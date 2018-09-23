using System;
using System.Collections.Generic;

namespace FlowerFinder
{
    public class SearchFlowerRegion
    {
        public string text { get; set; }
    }

    public class SearchFlowerPlant
    {
        public string _id { get; set; }
        public int __v { get; set; }
        public DateTime created { get; set; }
        public List<string> pictures { get; set; }
        public List<SearchFlowerRegion> region { get; set; }
        public List<object> careReminders { get; set; }
        public List<object> moreOptions { get; set; }
        public string careTips { get; set; }
        public string description { get; set; }
        public string scientificName { get; set; }
        public string commonName { get; set; }
    }

    public class SearchFlowerModel
    {
        public List<SearchFlowerPlant> plants { get; set; }
        public int total { get; set; }
        public bool isMoreData { get; set; }
    }
}
