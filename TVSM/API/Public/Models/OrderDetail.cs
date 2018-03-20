using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Public.Models
{
    public class OrderDetail
    {
        public string Order { get; set; }
        public string Tool { get; set; }
        public DateTime ScheduledComplete { get; set; }
        public float Estimate { get; set; }
        public float Actual { get; set; }
    }
}