using System.Text;
using System.Web.Optimization;
public class PartialsTransform : IBundleTransform
{
    private readonly string _moduleName;
    public PartialsTransform(string moduleName)
    {
        _moduleName = moduleName;
    }

    public void Process(BundleContext context, BundleResponse response)
    {
        var strBundleResponse = new StringBuilder();
        // Javascript module for Angular that uses templateCache 
        strBundleResponse.AppendFormat(
            @"angular.module('{0}').run(['$templateCache',function(t){{",
            _moduleName);

            foreach (var file in response.Files)
            {
                // Get content of file
                var content = file.ApplyTransforms();
                // Remove newlines and replace ' with \\'
                content = content.Replace("'", "\\'").Replace("\r\n", "");
                // Find templateUrl by getting file path and removing inital ~
                var templateUrl = file.VirtualFile.VirtualPath;
                // Add content of template file inside an Angular put method
                strBundleResponse.AppendFormat("t.put('{0}{1}','{2}');", System.Web.Configuration.WebConfigurationManager.AppSettings["Server"], templateUrl, content);
            }
        strBundleResponse.Append(@"}]);");

        response.Files = new BundleFile[] { };
        response.Content = strBundleResponse.ToString();
        response.ContentType = "text/javascript";
    }
}