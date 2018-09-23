using System;
using System.Collections.Generic;

namespace FlowerFinder
{
    public class PlantId
    {
        public string _id { get; set; }
        public int __v { get; set; }
        public DateTime created { get; set; }
        public List<object> pictures { get; set; }
        public List<object> region { get; set; }
        public List<object> careReminders { get; set; }
        public List<object> moreOptions { get; set; }
        public string careTips { get; set; }
        public string description { get; set; }
        public string scientificName { get; set; }
        public string commonName { get; set; }
        public bool isFavourite { get; set; }
    }

    public class Recognition
    {
        public int __v { get; set; }
        public string recognitionNo { get; set; }
        public string recognitionImageURL { get; set; }
        public string notes { get; set; }
        public string status { get; set; }
        public string _id { get; set; }
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
        public bool isDeleted { get; set; }
        public string recognitionThumbImageURL { get; set; }
        public PlantId plantId { get; set; }
        public string userId { get; set; }
        public object hrUserId { get; set; }
    }

    public class RecognizedFlowerDetailsModel
    {
        public string status { get; set; }
        public Recognition recognition { get; set; }
    }
}
