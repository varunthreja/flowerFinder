using System;
using System.Collections.Generic;

namespace FlowerFinder
{
    //make favourite 
    public class MakeFavouriteModel
    {
        public string status { get; set; }
        public string message { get; set; }
        public long lastModified { get; set; }
    }

    //favourite list 

    public class Region
    {
        public string text { get; set; }
    }

    public class FavouritePlantId
    {
        public string _id { get; set; }
        public int __v { get; set; }
        public DateTime created { get; set; }
        public List<string> pictures { get; set; }
        public List<Region> region { get; set; }
        public List<object> careReminders { get; set; }
        public List<object> moreOptions { get; set; }
        public string careTips { get; set; }
        public string description { get; set; }
        public string scientificName { get; set; }
        public string commonName { get; set; }
    }

    public class FavouritePlants
    {
        public FavouritePlantId plantId { get; set; }
        public DateTime updated { get; set; }
        public DateTime created { get; set; }
        public bool isDeleted { get; set; }
    }

    public class FavouriteFlowerListModel
    {
        public string status { get; set; }
        public List<FavouritePlants> plants { get; set; }
        public DateTime lastModified { get; set; }
    }


}
