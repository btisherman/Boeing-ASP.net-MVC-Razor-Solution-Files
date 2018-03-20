namespace TVSM.Security
{
    using System.ComponentModel.DataAnnotations;

    public partial class User
    {
        public int UserId { get; set; }
        public string BemsId { get; set; }
        public string Role { get; set; }
    }

    public static class UserRoles
    {
        public const string ADM = "ADM";
        public const string CMA = "CMA";
        public const string IE = "IE";
        public const string ME = "ME";
        public const string NWP = "NWP";
        public const string Other = "Other";
        public const string TE = "TE";
        public const string TIA = "TIA";
        public const string TIE = "TIE";
        public const string TME = "TME";
        public const string Guest = "Guest";
    }
}
