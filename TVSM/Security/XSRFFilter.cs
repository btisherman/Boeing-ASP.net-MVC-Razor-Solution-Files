using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Helpers;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace TVSM.Security
{
    public class XSRFFilter: ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (actionContext.ActionDescriptor.GetCustomAttributes<SkipXSRFAttribute>().Any())
            {
                return;
            }

            string cookieToken = "";
            string formToken = "";

                IEnumerable<string> tokenHeaders;
                if (actionContext.Request.Headers.TryGetValues("X-XSRF-TOKEN", out tokenHeaders))
                {
                    string[] tokens = tokenHeaders.First().Split(':');
                    if (tokens.Length == 2)
                    {
                        cookieToken = tokens[0].Trim();
                        formToken = tokens[1].Trim();
                    }
                }
                try
                {
                    var context = System.Web.HttpContext.Current;
                    AntiForgery.Validate(cookieToken, formToken);
                }
                catch
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(System.Net.HttpStatusCode.Forbidden, "Antiforgery Token does not match");
                }
        }

    }
}