namespace TVSM.API.Modules.LoadProfile
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class Load_Profile
    {
        public string OrderID { get; set; }

        public string CCV { get; set; }

        public DateTime? CalDate { get; set; }

        public decimal? Hrs { get; set; }
    }
}
