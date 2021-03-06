/****** Object:  UserDefinedTableType [dbo].[IDSTRING]    Script Date: 4/25/2016 4:26:34 PM ******/
CREATE TYPE [dbo].[IDSTRING] AS TABLE(
	[ID] [nvarchar](25) NOT NULL,
	PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (IGNORE_DUP_KEY = OFF)
)
GO
/****** Object:  Table [dbo].[tblAR]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblAR](
	[AR #] [int] NOT NULL,
	[ToolCode] [nvarchar](50) NULL,
	[PartNum] [nvarchar](50) NULL,
	[Tool NumberAR] [nvarchar](255) NULL,
	[Tool Number] [nvarchar](50) NULL,
	[Plan Status] [nvarchar](50) NULL,
	[ToolUnit] [nvarchar](50) NULL,
	[RAMAC] [nvarchar](40) NOT NULL,
	[Problem] [nvarchar](max) NULL,
	[Resolution] [nvarchar](max) NULL,
	[AssignDate] [datetime] NULL,
	[AssignedToName] [nvarchar](75) NULL,
	[AssignedTo] [int] NULL,
	[UpdateDate] [datetime] NULL,
	[UpdatedByName] [nvarchar](75) NULL,
	[UpdatedBy] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedByName] [nvarchar](75) NULL,
	[CreateDate] [datetime] NULL,
	[Status_Id] [int] NULL,
	[StatusCode] [nvarchar](6) NULL,
	[StatusDescription] [nvarchar](45) NULL,
	[Check] [bit] NULL,
	[ECD] [datetime] NULL,
	[Program] [nvarchar](255) NULL,
	[TypeCode] [nvarchar](255) NULL,
	[Priority] [nvarchar](255) NULL,
	[ActCompDate] [datetime] NULL,
 CONSTRAINT [PK_tblAR] PRIMARY KEY CLUSTERED 
(
	[AR #] ASC,
	[RAMAC] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tblLoad_Profile_TESTING]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tblLoad_Profile_TESTING](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[OrderID] [varchar](50) NOT NULL,
	[CCV] [varchar](255) NULL,
	[CalDate] [datetime] NULL,
	[WeekEnding] [datetime] NULL,
	[Hrs] [decimal](18, 2) NULL,
 CONSTRAINT [PK_tblLoad_Profile_TESTING] PRIMARY KEY CLUSTERED 
(
	[ID] ASC,
	[OrderID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tblNCR_Order_ID]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblNCR_Order_ID](
	[NCR] [nvarchar](255) NOT NULL,
	[Rev] [nvarchar](255) NULL,
	[Order ID] [nvarchar](20) NOT NULL,
	[Queue_Q_INFO] [nvarchar](15) NULL,
	[Arrival Date] [datetime] NULL,
	[ASGND_TO_NM] [nvarchar](35) NULL,
	[Check] [int] NULL CONSTRAINT [DF_tblNCR_Order_ID_Check]  DEFAULT ((0)),
	[Last Update] [datetime] NULL,
	[Program] [nvarchar](255) NULL,
	[Status] [nvarchar](255) NULL,
	[ACCP_Pos] [nvarchar](255) NULL,
	[LN] [nvarchar](255) NULL,
	[Created_Date] [datetime] NULL,
	[Tool_Number] [nvarchar](255) NULL,
	[Unit_Name] [nvarchar](255) NULL,
	[Serial_Number] [nvarchar](255) NULL,
 CONSTRAINT [PK_tblNCR_Order_ID] PRIMARY KEY CLUSTERED 
(
	[NCR] ASC,
	[Order ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tblSAT_Order_ID]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblSAT_Order_ID](
	[Program] [nvarchar](255) NULL,
	[SAT] [int] NOT NULL,
	[Order ID] [nvarchar](255) NOT NULL,
	[SatECD] [datetime] NULL,
	[OrgName] [nvarchar](30) NULL,
	[OrgPassedTo] [nvarchar](60) NULL,
	[Problem Type] [nvarchar](255) NULL,
	[ResponseNumber] [int] NULL,
	[Check] [int] NULL,
	[SAT Date] [datetime] NULL,
 CONSTRAINT [PK_tblSAT_Order_ID] PRIMARY KEY CLUSTERED 
(
	[SAT] ASC,
	[Order ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tblSFM_Oper]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tblSFM_Oper](
	[Order ID] [varchar](40) NULL,
	[OPERATIONID] [int] NULL,
	[INSPTYPE] [varchar](50) NULL,
	[OperNo] [varchar](7) NULL,
	[STATUS] [varchar](1) NULL,
	[ACTION] [varchar](15) NULL,
	[ONHOLD] [int] NULL,
	[HoldCode] [varchar](10) NULL,
	[DateOnHold] [datetime] NULL,
	[DATESTARTPLAN] [datetime] NULL,
	[DATESTARTACTL] [datetime] NULL,
	[DATECOMPPLAN] [datetime] NULL,
	[DATECOMPACTL] [datetime] NULL,
	[InProcess_Status] [varchar](10) NULL,
	[SETUPTIME] [numeric](11, 4) NULL,
	[TOTALRUNTIME] [numeric](11, 4) NULL,
	[TotEstmOp] [numeric](12, 4) NULL,
	[PLANOPERID] [int] NULL,
	[SUBSTATUSDESC] [varchar](128) NULL,
	[PRIORITYSORDORDER] [int] NULL,
	[DESCRIPTION] [varchar](128) NULL,
	[BASEOPER] [varchar](1) NULL,
	[OPERAVAILABLE] [varchar](1) NULL,
	[WorkCenter] [varchar](10) NULL,
	[WorkArea] [varchar](10) NULL,
	[WorkLoc] [varchar](20) NULL,
	[Update Date] [datetime] NULL,
	[Status_Ready] [varchar](8) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tblTVSM]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tblTVSM](
	[Validation Date] [datetime] NULL,
	[Group Name] [varchar](50) NULL,
	[Order ID] [varchar](50) NOT NULL,
	[Tool Code] [varchar](50) NULL,
	[Tool Number] [varchar](50) NULL,
	[Serial Number] [varchar](255) NULL,
	[Unit] [int] NULL,
	[Form Type] [varchar](50) NULL,
	[W/O] [varchar](50) NULL,
	[Tool Name] [varchar](100) NULL,
	[Seq] [int] NULL,
	[Rev] [int] NULL,
	[Plan Status] [varchar](50) NULL,
	[Effectivity] [varchar](50) NULL,
	[RC] [varchar](255) NULL,
	[ACCP] [varchar](50) NULL,
	[Scheduled Start] [datetime] NULL,
	[Scheduled Complete] [datetime] NULL,
	[Actual Start] [datetime] NULL,
	[Actual Complete] [datetime] NULL,
	[Design - Auto Estimate] [int] NULL,
	[Fab - Auto Estimate] [int] NULL,
	[Const - Auto Estimate] [int] NULL,
	[Auto Est] [int] NULL,
	[Auto Est by] [varchar](255) NULL,
	[Action] [varchar](50) NULL,
	[Size] [varchar](50) NULL,
	[Complexity] [varchar](50) NULL,
	[Routine] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Routine]  DEFAULT ((0)),
	[Check] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Check]  DEFAULT ((0)),
	[Leveling] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Leveling]  DEFAULT ((0)),
	[Plumb square] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Plumb square]  DEFAULT ((0)),
	[# OTP] [int] NULL,
	[Duplicate] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Duplicate]  DEFAULT ((0)),
	[Deactivate] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Deactivate]  DEFAULT ((0)),
	[Reactivate] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Reactivate]  DEFAULT ((0)),
	[Preventive Maintenance] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Preventive Maintenance]  DEFAULT ((0)),
	[PM Type] [varchar](255) NULL,
	[Remarks] [varchar](max) NULL,
	[New Tool] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_New Tool]  DEFAULT ((0)),
	[Spec Tool] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Spec Tool]  DEFAULT ((0)),
	[Rework] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Rework]  DEFAULT ((0)),
	[Add] [int] NULL,
	[Attach] [int] NULL,
	[Cut] [int] NULL,
	[Check/Insp] [int] NULL,
	[Drill] [int] NULL,
	[Fabricate] [int] NULL,
	[Heat Treat] [int] NULL,
	[Install] [int] NULL,
	[Machining] [int] NULL,
	[Paint] [int] NULL,
	[Received] [int] NULL,
	[Re ID] [int] NULL,
	[Remove] [int] NULL,
	[Weld] [int] NULL,
	[CalCert] [int] NULL,
	[PF_D] [int] NULL,
	[Travel] [int] NULL,
	[Clean] [int] NULL,
	[Timestamp] [datetime] NULL,
	[ChangeDate] [datetime] NULL,
	[Ready for IPT] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Ready for IPT]  DEFAULT ((0)),
	[Walk -in] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Walk -in]  DEFAULT ((0)),
	[Study] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Study]  DEFAULT ((0)),
	[Start] [datetime] NULL,
	[Finish] [datetime] NULL,
	[Est update] [datetime] NULL,
	[Held on Queue] [varchar](50) NULL,
	[TotalEst] [int] NULL,
	[Late Adds] [varchar](50) NULL,
	[Agenda] [varchar](50) NULL,
	[Email] [datetime] NULL,
	[Staged] [datetime] NULL,
	[IE Pull] [datetime] NULL,
	[TME] [datetime] NULL,
	[Held For] [varchar](255) NULL,
	[Category] [varchar](255) NULL,
	[EWA] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_EWA]  DEFAULT ((0)),
	[EWA Date] [datetime] NULL,
	[CLASS] [varchar](255) NULL,
	[Program] [varchar](255) NULL,
	[Shop Aid] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Shop Aid]  DEFAULT ((0)),
	[2nd SAI] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_2nd SAI]  DEFAULT ((0)),
	[Paddle Fitting] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Paddle Fitting]  DEFAULT ((0)),
	[Tooling Project] [varchar](255) NULL,
	[PM] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_PM]  DEFAULT ((0)),
	[Area] [varchar](255) NULL,
	[Work Area] [varchar](255) NULL,
	[Active Work Area] [varchar](255) NULL,
	[TD] [varchar](255) NULL,
	[Est Confirmed] [varchar](255) NULL,
	[Machine Shop] [varchar](255) NULL,
	[SAT] [varchar](255) NULL,
	[SAT Bucket] [varchar](255) NULL,
	[SAT ECD] [datetime] NULL,
	[TR/TIDR/DRTR] [varchar](255) NULL,
	[ME] [varchar](255) NULL,
	[IP#] [varchar](255) NULL,
	[Sent by] [varchar](255) NULL,
	[Designer] [varchar](255) NULL,
	[TIM] [varchar](255) NULL,
	[Checker] [varchar](255) NULL,
	[Actual Est] [int] NULL,
	[AR #] [varchar](255) NULL,
	[AR Assigned] [varchar](255) NULL,
	[Order Status] [varchar](255) NULL,
	[TE Comments] [varchar](255) NULL,
	[Created by] [varchar](255) NULL,
	[Created Date] [datetime] NULL,
	[Recd @ kitting] [datetime] NULL,
	[Pre-TTO Chk] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Pre-TTO Chk]  DEFAULT ((0)),
	[Pre-TTO] [varchar](255) NULL,
	[TTO] [varchar](255) NULL,
	[TTO Date] [datetime] NULL,
	[ELR] [int] NULL,
	[NCR] [int] NULL,
	[NCR Status] [varchar](255) NULL,
	[Error type] [varchar](255) NULL,
	[TTO Notes] [varchar](max) NULL,
	[From Design] [varchar](255) NULL,
	[Related Order] [varchar](255) NULL,
	[PKG] [varchar](255) NULL,
	[Pos] [varchar](255) NULL,
	[LN] [int] NULL,
	[Load Date] [datetime] NULL,
	[Downtime Letter] [varchar](255) NULL,
	[Passenger] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Passenger]  DEFAULT ((0)),
	[Pass Only] [varchar](255) NULL,
	[PLANKEY] [varchar](255) NULL,
	[Part Key] [varchar](255) NULL,
	[Dsgn Part Key] [varchar](255) NULL,
	[Design Link] [varchar](255) NULL,
	[ActivityID] [varchar](255) NULL,
	[Bid PKG] [int] NULL,
	[Bid Due Date] [datetime] NULL,
	[Awarded Date] [datetime] NULL,
	[Supplier ECD] [datetime] NULL,
	[Supplier] [varchar](255) NULL,
	[Tool Type] [varchar](255) NULL,
	[ETVS Notes] [varchar](max) NULL,
	[ETVS %] [varchar](255) NULL,
	[SOW] [varchar](max) NULL,
	[Do Status] [varchar](255) NULL,
	[Active Org] [varchar](255) NULL,
	[PDR] [datetime] NULL,
	[CDR] [datetime] NULL,
	[FDR] [datetime] NULL,
	[Released to CMA] [datetime] NULL,
	[Offboard Date] [datetime] NULL,
	[Top 5] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Top 5]  DEFAULT ((0)),
	[Print] [bit] NOT NULL CONSTRAINT [DF_tblTVSM_Print]  DEFAULT ((0)),
	[NCR Assigned] [varchar](255) NULL,
	[Last Update Date] [datetime] NULL,
	[Last Update BEMS] [varchar](255) NULL,
	[Active Op #] [int] NULL,
	[Active Op Desc] [varchar](255) NULL,
	[Active Op Status] [varchar](255) NULL,
	[% Comp] [varchar](255) NULL,
	[Emergent Task] [varchar](255) NULL,
	[WA required] [varchar](255) NULL,
	[Design Sch Comp] [datetime] NULL,
	[TOOL ECD] [datetime] NULL,
	[Chk] [datetime] NULL,
	[Stress] [datetime] NULL,
	[Sch_Start] [datetime] NULL,
	[Sch_Comp] [datetime] NULL,
	[Sch_PDR] [datetime] NULL,
	[Sch_CDR] [datetime] NULL,
	[Sch_FDR] [datetime] NULL,
	[Sch_Chk] [datetime] NULL,
	[Sch_CMA] [datetime] NULL,
	[Order Start Status] [varchar](255) NULL,
	[Order Comp Status] [varchar](255) NULL,
	[CTOL Control Code] [varchar](255) NULL,
	[DetailNumber] [varchar](50) NULL,
	[Releaser] [varchar](255) NULL,
	[WIPNotes] [varchar](max) NULL,
	[Sch_Stress] [datetime] NULL,
	[Stress_Req] [int] NULL,
 CONSTRAINT [PK_tblTVSM] PRIMARY KEY CLUSTERED 
(
	[Order ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, FILLFACTOR = 90) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[tblUsers]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblUsers](
	[Name] [nvarchar](255) NULL,
	[NT User] [nvarchar](255) NULL,
	[Initials] [nvarchar](255) NULL,
	[Position] [nvarchar](255) NULL,
	[BEMSID] [int] NULL,
	[Focal] [nvarchar](255) NULL,
	[Work Area] [nvarchar](255) NULL,
	[ID] [int] IDENTITY(1,1) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  StoredProcedure [dbo].[uspSSRS_CapacityLoadRollup_NEW]    Script Date: 4/25/2016 4:26:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROC [dbo].[uspSSRS_CapacityLoadRollup_NEW]
	@OrderID IDString READONLY
	,@ChartType AS varchar(5) -- M = Month, W = Week, D = Day
AS	
BEGIN
	DECLARE @i INT
	DECLARE @DATE AS DATE = GETDATE()
	DECLARE @UpdateDate AS DATE
	DECLARE @WeekEndingID INT  = 3 -- 0=Mon, 1=Tue, 2 = Wed, ..., 5=Sat, 6=Sun
	SET @UpdateDate = (SELECT GETDATE())

-- Declare Table for Stuff
	DECLARE @Stuff AS Table ([Date] Date, [OrderID] varchar(50), [CCV] varchar (255), [TotalHrs] DECIMAL (18,2)
		PRIMARY KEY ([DATE],[OrderID],[CCV]))
-- Declare date table	
	DECLARE @DateTable AS TABLE ([Date] Date NOT NULL PRIMARY KEY, [CurrentCycle] varchar (5))

IF @ChartType = 'M'
BEGIN -- BY MONTH
	--****************************************************************
	--______        ___  ___            _   _     
	--| ___ \       |  \/  |           | | | |    
	--| |_/ /_   _  | .  . | ___  _ __ | |_| |__  
	--| ___ \ | | | | |\/| |/ _ \| '_ \| __| '_ \ 
	--| |_/ / |_| | | |  | | (_) | | | | |_| | | |
	--\____/ \__, | \_|  |_/\___/|_| |_|\__|_| |_|
	--        __/ |                               
	--       |___/                                
	--****************************************************************

	-- Create Date Month List
	SET @i = 0 -- Adjust for the First Month to be displayed on the Chart
		WHILE @i <= 26 -- Adjust for the last Month to be diaplayed on the chart
		BEGIN 
			INSERT INTO @DateTable ([Date],[CurrentCycle])

			SELECT
				DATEADD(MONTH,@i,DATEFROMPARTS(YEAR(GETDATE()),MONTH(GETDATE()),1))
				,CASE WHEN @i = 0 THEN 'Y' WHEN @i < 0 THEN 'P' ELSE 'F' END AS [CurrentCycle]
			SET @i = @i + 1
		END
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
--************************************-- MAIN QUERY --*************************************--
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
INSERT INTO @Stuff  ([Date], [OrderID], [CCV], [TotalHrs])
	SELECT DISTINCT
		A.[Date],
		LP.[OrderID],
		LP.[CCV],
		SUM(LP.[Hrs]) AS [TotalHrs]
	FROM @DateTable AS A

LEFT JOIN [dbo].[tblLoad_Profile_Testing] AS LP
ON A.[Date] = DATEFROMPARTS(YEAR([CalDate]),MONTH([CalDate]),1)

JOIN (SELECT CAST(L.ID AS VARCHAR(25)) AS ID FROM @OrderID AS L) AS OID
ON LP.[OrderID] = OID.ID

GROUP BY A.[Date],LP.[OrderID],LP.[CCV]
END
ELSE IF @ChartType = 'W'
BEGIN -- BY WEEK
--****************************************************************
--______         _    _           _    
--| ___ \       | |  | |         | |   
--| |_/ /_   _  | |  | | ___  ___| | __
--| ___ \ | | | | |/\| |/ _ \/ _ \ |/ /
--| |_/ / |_| | \  /\  /  __/  __/   < 
--\____/ \__, |  \/  \/ \___|\___|_|\_\
--        __/ |                        
--       |___/                         
--****************************************************************
	-- Create Date Week List
	DECLARE @DateThurdsay AS DATE 

	SELECT @DateThurdsay =
		CASE DATEPART(weekday,@DATE)
			WHEN 1 THEN DATEADD(DAY,4,CAST(@DATE AS DATE))
			WHEN 2 THEN DATEADD(DAY,3,CAST(@DATE AS DATE))
			WHEN 3 THEN DATEADD(DAY,2,CAST(@DATE AS DATE))
			WHEN 4 THEN DATEADD(DAY,1,CAST(@DATE AS DATE))
			WHEN 5 THEN DATEADD(DAY,0,CAST(@DATE AS DATE))
			WHEN 6 THEN DATEADD(DAY,6,CAST(@DATE AS DATE))
			WHEN 7 THEN DATEADD(DAY,5,CAST(@DATE AS DATE))
		END

	SET @i = 0 -- Adjust for the First Week to be displayed on the Chart
		WHILE @i <= 26 -- Adjust for the last Week to be diaplayed on the chart
	
		BEGIN 
			INSERT INTO @DateTable ([Date], [CurrentCycle])

			SELECT
				DATEADD(WEEK,@i,@DateThurdsay)
				,CASE WHEN @i = 0 THEN 'Y' WHEN @i < 0 THEN 'P' ELSE 'F' END AS [CurrentCycle]
			SET @i = @i + 1
		END

---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
--************************************-- MAIN QUERY --*************************************--
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------
INSERT INTO @Stuff  ([Date], [OrderID], [CCV], [TotalHrs])
	SELECT DISTINCT
		A.[Date],
		LP.[OrderID],
		LP.[CCV],
		SUM(LP.[Hrs]) AS [TotalHrs]
	FROM @DateTable AS A

LEFT JOIN [dbo].[tblLoad_Profile_Testing] AS LP
-- I used this method to calculate thursday as end of week - Bill Burrows
--ON A.[Date] = DATEADD(DAY, (DATEDIFF(DAY, @WeekEndingID+1, LP.CalDate) / 7) * 7 + 7, @WeekEndingID)
ON A.[Date] = LP.WeekEnding
		--Old method
		--ON A.[Date] = (SELECT MAX(Calendar_Date) FROM M_Day_Calendar
		--WHERE [DayOfWeek] = 'Thursday' AND Calendar_Date <= LP.CalDate)

JOIN (SELECT CAST(L.ID AS VARCHAR(25)) AS ID FROM @OrderID AS L) AS OID
ON LP.[OrderID] = OID.ID

GROUP BY A.[Date], LP.[OrderID], LP.[CCV]
END
SELECT
	[DateTbl].[Date]
	,Stf.[CCV]
	,Stf.[OrderIDs]
	,SUM([TotalHrs]) AS [TotalHrs]
FROM @DateTable AS [DateTbl]
LEFT JOIN (SELECT [Date], [CCV], [OrderIDs] = 
			STUFF((SELECT ',' + CAST([OrderID] AS Varchar)
				   FROM @stuff AS B
				   WHERE B.[Date] = A.[Date] 
				   AND B.[CCV] = A.[CCV]
				  FOR XML PATH('')), 1, 1, '')
		FROM @stuff AS A
		GROUP BY [Date], [CCV]) AS Stf

ON [DateTbl].[Date] = Stf.[Date]

LEFT JOIN @Stuff AS Ttl

ON [DateTbl].[Date] = Ttl.[Date]
AND Stf.[CCV] = Ttl.[CCV]

GROUP BY [DateTbl].[Date],Stf.[CCV],Stf.[OrderIDs]

END
GO
