using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.LoadProfile
{
    public class LoadProfileRow
    {
        public string orderID { get; set; }
        public DateTime? start { get; set; }
        public DateTime? end { get; set; }
        public string type { get; set; }
        public double? btg { get; set; }
    }
}