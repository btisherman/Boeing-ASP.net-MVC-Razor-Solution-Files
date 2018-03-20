using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.Models
{
    public class UserInfo
    {
        public string ID { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}