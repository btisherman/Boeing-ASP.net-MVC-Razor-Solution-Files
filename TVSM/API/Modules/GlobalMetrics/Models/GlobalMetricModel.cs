using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TVSM.API.Modules.GlobalMetrics.Models
{
    public class GlobalMetricModel
    {
        public string Site { get; set; }
        public string Program { get; set; }
        public float Weight { get; set; }
        public float Overall { get; set; }
        public float Schedule { get; set; }
        public float Quality { get; set; }
        public float Cost { get; set; }
        public float Forecast { get; set; }
    }
}