using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.BCADashboard.Models
{
    public class HFHealthQuery
    {
        //Responsibility, Health, Count(*) Qty
        public string Responsibility { get; set; }
        public string Health { get; set; }
        public int Qty { get; set; }
    }
}