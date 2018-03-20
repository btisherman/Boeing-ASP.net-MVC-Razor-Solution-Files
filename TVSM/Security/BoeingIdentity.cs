using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace TVSM.Security
{
    public class BoeingIdentity: GenericPrincipal
    {
        public readonly string[] Roles;
        public BoeingIdentity(string name, string[] roles): base(new GenericIdentity(name), roles)
        {
            Roles = roles;
        }

    }
}