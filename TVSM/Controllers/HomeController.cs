using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using TVSM.Models;
using TVSM.Security;

namespace TVSM.Controllers
{
    public class HomeController : Controller
    {
        // GET: Main
        public ActionResult Index()
        {
            string cookieToken, formToken;
            AntiForgery.GetTokens(null, out cookieToken, out formToken);
            var cookieString = cookieToken + ":" + formToken;

            HttpCookie myCookie = new HttpCookie("XSRF-TOKEN", cookieString);

            Response.Cookies.Add(myCookie);

            return View(GetUser());
        }


        /// <summary>
        /// Gets current user's ID and list of roles.
        /// </summary>
        /// <returns>The method returns a UserInfo object</returns>
        private UserInfo GetUser()
        {
            var roles = ((BoeingIdentity)User).Roles;

            return new UserInfo
            {
                ID = User.Identity.Name,
                Roles = roles
            };
        }
    
    
    }

       
}