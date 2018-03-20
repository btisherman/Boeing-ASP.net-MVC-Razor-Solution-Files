using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WorkflowManager.API.Models;

namespace WorkflowManager.App_Start
{
    public class AutoMapperConfig
    {
        public static MapperConfiguration config { get; set; }

        public static void RegisterMappings()
        {
            config = new MapperConfiguration(cfg => cfg.CreateMap<Task, TaskVM>());

        }
    }
}