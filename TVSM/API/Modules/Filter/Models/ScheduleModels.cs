using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace TVSM.API.Modules.Filter.Models
{
    public class ScheduleModel
    {
        public string order { get; set; }
        public DateTime? start { get; set; }
        public DateTime? comp { get; set; }
        public int? percent { get; set; }
    }

    public class ScheduleResult
    {
        public string order { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Health health { get; set; }
    }

    public enum Health
    {
        Gray,
        Red,
        Yellow,
        Green
    }
}