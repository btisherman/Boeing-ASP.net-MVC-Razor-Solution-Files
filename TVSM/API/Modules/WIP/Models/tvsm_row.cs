using System;

namespace TVSM.API.Modules.WIP
{
    public class tvsm_row
    {
        public DateTime? Validation_Date { get; set; }

        public string Group_Name { get; set; }

        public string Order_ID { get; set; }

        public string Tool_Code { get; set; }

        public string Tool_Number { get; set; }

        public string Serial_Number { get; set; }

        public int? Unit { get; set; }

        public string Form_Type { get; set; }

        public string WO { get; set; }  //W/O

        public string Tool_Name { get; set; }

        public int? Seq { get; set; }

        public int? Rev { get; set; }

        public string Plan_Status { get; set; }

        public string Effectivity { get; set; }

        public string RC { get; set; }

        public string ACCP { get; set; }

        public DateTime? Scheduled_Start { get; set; }

        public DateTime? Scheduled_Complete { get; set; }

        public DateTime? Actual_Start { get; set; }

        public DateTime? Actual_Complete { get; set; }

        public int? Design_Auto_Estimate { get; set; }  //Design_-_Auto_Estimate

        public int? Fab_Auto_Estimate { get; set; }  //Fab_-_Auto_Estimate

        public int? Const_Auto_Estimate { get; set; }  //Const_-_Auto_Estimate

        public int? Auto_Est { get; set; }

        public string Auto_Est_by { get; set; }

        public string Action { get; set; }

        public string Size { get; set; }

        public string Complexity { get; set; }

        public bool Routine { get; set; }

        public bool Check { get; set; }

        public bool Leveling { get; set; }

        public bool Plumb_square { get; set; }

        public int? numOTP { get; set; }  //#_OTP

        public bool Duplicate { get; set; }

        public bool Deactivate { get; set; }

        public bool Reactivate { get; set; }

        public bool Preventive_Maintenance { get; set; }

        public string PM_Type { get; set; }

        public string Remarks { get; set; }

        public bool New_Tool { get; set; }

        public bool Spec_Tool { get; set; }

        public bool Rework { get; set; }

        public int? Add { get; set; }

        public int? Attach { get; set; }

        public int? Cut { get; set; }

        public int? Check_Insp { get; set; }  //Check/Insp

        public int? Drill { get; set; }

        public int? Fabricate { get; set; }

        public int? Heat_Treat { get; set; }

        public int? Install { get; set; }

        public int? Machining { get; set; }

        public int? Paint { get; set; }

        public int? Received { get; set; }

        public int? Re_ID { get; set; }

        public int? Remove { get; set; }

        public int? Weld { get; set; }

        public int? CalCert { get; set; }

        public int? PF_D { get; set; }

        public int? Travel { get; set; }

        public int? Clean { get; set; }

        public DateTime? Timestamp { get; set; }

        public DateTime? ChangeDate { get; set; }

        public bool Ready_for_IPT { get; set; }

        public bool Walk_in { get; set; }  //Walk_-in

        public bool Study { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        public DateTime? Est_update { get; set; }

        public string Held_on_Queue { get; set; }

        public int? TotalEst { get; set; }

        public string Late_Adds { get; set; }

        public string Agenda { get; set; }

        public DateTime? Email { get; set; }

        public DateTime? Staged { get; set; }

        public DateTime? IE_Pull { get; set; }

        public DateTime? TME { get; set; }

        public string Held_For { get; set; }

        public string Category { get; set; }

        public bool EWA { get; set; }

        public DateTime? EWA_Date { get; set; }

        public string CLASS { get; set; }

        public string Program { get; set; }

        public bool Shop_Aid { get; set; }

        public bool SAI_2 { get; set; }  //2nd_SAI

        public bool Paddle_Fitting { get; set; }

        public string Tooling_Project { get; set; }

        public bool PM { get; set; }

        public string Area { get; set; }

        public string Work_Area { get; set; }

        public string Active_Work_Area { get; set; }

        public string TD { get; set; }

        public string Est_Confirmed { get; set; }

        public string Machine_Shop { get; set; }

        public string SAT { get; set; }

        public string SAT_Bucket { get; set; }

        public DateTime? SAT_ECD { get; set; }

        public string TR_TIDR_DRTR { get; set; } //TR/TIDR/DRTR

        public string ME { get; set; }

        public string IPnum { get; set; }  //IP#

        public string Sent_by { get; set; }

        public string Designer { get; set; }

        public string TIM { get; set; }

        public string Checker { get; set; }

        public int? Actual_Est { get; set; }

        public string AR_num { get; set; }  //AR_#

        public string AR_Assigned { get; set; }

        public string Order_Status { get; set; }

        public string TE_Comments { get; set; }

        public string Created_by { get; set; }

        public DateTime? Created_Date { get; set; }

        public DateTime? Recd_at_kitting { get; set; }  //Recd_@_kitting

        public bool Pre_TTO_Chk { get; set; }  //Pre-TTO_Chk

        public string Pre_TTO { get; set; }  //Pre-TTO

        public string TTO { get; set; }

        public DateTime? TTO_Date { get; set; }

        public int? ELR { get; set; }

        public int? NCR { get; set; }

        public string NCR_Status { get; set; }

        public string Error_type { get; set; }

        public string TTO_Notes { get; set; }

        public string From_Design { get; set; }

        public string Related_Order { get; set; }

        public string PKG { get; set; }

        public string Pos { get; set; }

        public int? LN { get; set; }

        public DateTime? Load_Date { get; set; }

        public string Downtime_Letter { get; set; }

        public bool Passenger { get; set; }

        public string Pass_Only { get; set; }

        public string PLANKEY { get; set; }

        public string Part_Key { get; set; }

        public string Dsgn_Part_Key { get; set; }

        public string Design_Link { get; set; }

        public string ActivityID { get; set; }

        public int? Bid_PKG { get; set; }

        public DateTime? Bid_Due_Date { get; set; }

        public DateTime? Awarded_Date { get; set; }

        public DateTime? Supplier_ECD { get; set; }

        public string Supplier { get; set; }

        public string Tool_Type { get; set; }

        public string ETVS_Notes { get; set; }

        public string ETVS_percent { get; set; } //ETVS_%

        public string SOW { get; set; }

        public string Do_Status { get; set; }

        public string Active_Org { get; set; }

        public DateTime? PDR { get; set; }

        public DateTime? CDR { get; set; }

        public DateTime? FDR { get; set; }

        public DateTime? Released_to_CMA { get; set; }

        public DateTime? Offboard_Date { get; set; }

        public bool Top_5 { get; set; }

        public bool Print { get; set; }

        public string NCR_Assigned { get; set; }

        public DateTime? Last_Update_Date { get; set; }

        public string Last_Update_BEMS { get; set; }

        public int? Active_Op_num { get; set; }  //Active_Op_#

        public string Active_Op_Desc { get; set; }

        public string Active_Op_Status { get; set; }

        public string Percent_Comp { get; set; }  //%_Comp

        public string Emergent_Task { get; set; }

        public string WA_required { get; set; }

        public DateTime? Design_Sch_Comp { get; set; }

        public DateTime? TOOL_ECD { get; set; }

        public DateTime? Chk { get; set; }

        public DateTime? Stress { get; set; }

        public DateTime? Sch_Start { get; set; }

        public DateTime? Sch_Comp { get; set; }

        public DateTime? Sch_PDR { get; set; }

        public DateTime? Sch_CDR { get; set; }

        public DateTime? Sch_FDR { get; set; }

        public DateTime? Sch_Chk { get; set; }

        public DateTime? Sch_CMA { get; set; }

        public string Order_Start_Status { get; set; }

        public string Order_Comp_Status { get; set; }

        public string CTOL_Control_Code { get; set; }

        public string DetailNumber { get; set; }

        public string Releaser { get; set; }

        public string WIPNotes { get; set; }

        public DateTime? Sch_Stress { get; set; }

        public int? Stress_Req { get; set; }
    }

}