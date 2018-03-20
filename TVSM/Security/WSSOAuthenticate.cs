using System;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Configuration;
using System.Web.Security;

namespace TVSM.Security
{
    public class WSSOAuthenticate
    {
        private HttpContext Context;

        public WSSOAuthenticate(HttpContext context)
        {
            Context = context;
        }

        public void Authenticate()
        {
             HttpCookie authCookie = Context.Request.Cookies[
                     FormsAuthentication.FormsCookieName];
             if (authCookie != null)
             {
                 LoginWithCookie(authCookie);
             }
             else
             {
                 LoginWithWSSO();
             }
        }

        private void LoginWithWSSO()
        {
            string id;
            string[] roles = new string[] { };
            UserRepo users = new UserRepo();
            id = Context.Request.ServerVariables["HTTP_BOEINGBEMSID"];
            if (WebConfigurationManager.AppSettings["Server"].Contains("localhost"))
            {
                id = "1870468";
            }
            // Get credential from the Authorization header 
            //(if present) and authenticate
            if (!string.IsNullOrEmpty(id))
            {
                var user = users.getUserRoles(id);
                if (user.Count > 0)
                {
                    roles = user.Select(u => u.Role.ToString()).ToArray();
                }
                else
                {
                    roles = new string[] { UserRoles.Guest };  
                }
                Context.User = new BoeingIdentity(id, roles);
            }
            Thread.CurrentPrincipal = Context.User;
            setCookie(id, roles);
        }

        private void LoginWithCookie(HttpCookie authCookie)
        {
            //Extract the forms authentication cookie
            try
            {
                FormsAuthenticationTicket authTicket =
                        FormsAuthentication.Decrypt(authCookie.Value);
                if (!authTicket.Expired)
                {
                    string[] Roles = getRolesFromTicket(authTicket);
                    Context.User = new BoeingIdentity(authTicket.Name, Roles);
                    Thread.CurrentPrincipal = Context.User;
                }
                else
                {
                    LoginWithWSSO();
                }
            }
            catch (Exception)
            {

                LoginWithWSSO();
            }

        }

        private void setCookie(string id, string[] roles)
        {
            string formsCookieStr = string.Empty;
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(
                     1,                                    // version
                     id,                              // user name
                     DateTime.Now,                        // issue time
                     DateTime.Now.AddHours(8),         // expires
                     true,                              // persistent
                     string.Join(",", roles)                  // user data
               );

            // Get the encrypted representation suitable for placing in a HTTP cookie.
            formsCookieStr = FormsAuthentication.Encrypt(ticket);
            HttpCookie FormsCookie = new HttpCookie(FormsAuthentication.FormsCookieName, formsCookieStr);
            FormsCookie.Expires = DateTime.Now.AddHours(8);
            Context.Response.Cookies.Add(FormsCookie);
        }

       

        private string[] getRolesFromTicket(FormsAuthenticationTicket authTicket)
        {
            return authTicket.UserData.Split(',').ToArray();
        }

    }
}