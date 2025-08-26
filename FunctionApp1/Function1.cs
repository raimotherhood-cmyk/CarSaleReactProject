using HttpMultipartParser;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Immutable;
using System.IO;
using System.Net;
using System.Text;
using System.Web;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace FunctionApp1;

public class Function1
{
    private readonly ILogger<Function1> _logger;

    public Function1(ILogger<Function1> logger)
    {
        _logger = logger;
    }

    [Function("getCarList")]
    public IActionResult getCarList([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");

        List<CarListResponseObject> objList = new List<CarListResponseObject>();
        for (int i = 1; i <= 5; i++)
        {
            var responseObject = new CarListResponseObject {ID=i.ToString(), Name = "Hello from Azure Function!   " + i, Price = 200+i , ImageURL=""};
            objList.Add(responseObject);
        }
        return new OkObjectResult(objList); // This will automatically serialize to JSON
    }

    [Function("setCarDetail")]
    public static async Task<IActionResult> setCarDetail(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req
            , FunctionContext exFunction )
    {
        var log = exFunction.GetLogger("setCarDetail");
        log.LogInformation("C# HTTP trigger function processed a request.");

        var form = await req.ReadFormAsync();
        var imageFile = form.Files["imagefile"];
        byte[] d = null;
        using (var memoryStream = new MemoryStream())
        {
            await imageFile.CopyToAsync(memoryStream);
              d = memoryStream.ToArray();
            System.IO.File.WriteAllBytes("C:\\Users\\bhaskar.rai\\source\\repos\\CarSaleReactProject\\FunctionApp1\\bin\\Debug\\"+imageFile.FileName,
                  d);
            // var blobClient = new BlobClient("connectionString", "containerName", "imageFileName.jpg");
            // memoryStream.Position = 0; // Reset stream position
            // await blobClient.UploadAsync(memoryStream);
        }
        var keys = form.ToList();
        Dictionary<string, string> stringData = new Dictionary<string, string>();
        string name = null;
        foreach (var key in keys)
        {
            stringData.Add(key.Key , key.Value.ToString());
            name = key.Value.ToString();
            
        }
        var inputJson = JsonConvert.SerializeObject(stringData);

        //string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

        //dynamic data = JsonConvert.DeserializeObject(requestBody);


        if (string.IsNullOrEmpty(name))
        {
            return new BadRequestObjectResult("{ 'id':'Please pass a name in the request body.'}");
        }
        string json = "{'outputid':'input recieved," + inputJson + ". This HTTP triggered function executed successfully.'}";
        return new OkObjectResult(json);
    }


    [Function("authenticate")]
    public static async Task<IActionResult> authenticate(
           [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req
           , FunctionContext exFunction)
    {
        var log = exFunction.GetLogger("authenticate");
        log.LogInformation("C# HTTP trigger function processed a request.");
        bool authenticated = false;
        var form = await  req.ReadFormAsync();
         
        var keys = form.ToList();
        
        string userid = null;
        string password = null;
        foreach (var key in keys)
        {
            
            if (key.Key == "userid")
            {
                userid = key.Value.ToString();
            }
            if (key.Key == "password")
            {
                password = key.Value.ToString();
            }

        }
        if(userid== "aa@gmail.com" && password=="admin")
        { 
            // connect with database if user is valid.
            authenticated = true;
        }

        if (!authenticated)
        {
            return new BadRequestObjectResult("{ 'userid':'Please check your user name and password.'}");
        }
        string json = "{'success':'" + authenticated + "'}";
        return new OkObjectResult(json);


       
         
    }
    [Function("registeruser")]
    public static async Task<IActionResult> registeruser(
           [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req
           , FunctionContext exFunction)
    {
        var log = exFunction.GetLogger("registeruser");
        log.LogInformation("C# HTTP trigger function processed a request.");
         
        var form = await req.ReadFormAsync();

        var keys = form.ToList();

        string userid = null;
        string password = null;
        string name = null;
        foreach (var key in keys)
        {
            if (key.Key == "name")
            {
                name = key.Value.ToString();
            }
            if (key.Key == "userid")
            {
                userid = key.Value.ToString();
            }
            if (key.Key == "password")
            {
                password = key.Value.ToString();
            }

        }
        if (userid != null && password != null && name != null)
        {
            // connect with database to create new user.            
        }

        string json = "{'outputid':' This HTTP triggered function executed successfully.'}";
        return new OkObjectResult(json);
    }

}
public class CarListResponseObject
{
    public string ID { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public string ImageURL { get; set; }
}
public class CarCreateRequestObject
{
    public string ID { get; set; }
    public string Name { get; set; }
    public int Price { get; set; }
    public string ImageURL { get; set; }
}