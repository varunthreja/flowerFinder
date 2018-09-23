using System;
using System.Collections.Generic;

namespace FlowerFinder
{
    // classes for HR response
    public class RecognizeRequestPlantId
    {
        public string _id { get; set; }
        public string scientificName { get; set; }
        public string commonName { get; set; }
    }

    public class HumanRecognition
    {
        public string _id { get; set; }
        public string recognitionNo { get; set; }
        public string recognitionImageURL { get; set; }
        public string notes { get; set; }
        public string status { get; set; }
        public int __v { get; set; }
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
        public bool isDeleted { get; set; }
        public string recognitionThumbImageURL { get; set; }
        public RecognizeRequestPlantId plantId { get; set; }
        public string userId { get; set; }
        public object hrUserId { get; set; }
    }

    public class RecognizeRequest
    {
        public string status { get; set; }
        public HumanRecognition recognition { get; set; }
        public string message { get; set; }
    }

    // classes for request list
    public class RequestListPlantId
    {
        public string _id { get; set; }
        public List<string> pictures { get; set; }
        public List<object> moreOptions { get; set; }
        public string careTips { get; set; }
        public string description { get; set; }
        public string scientificName { get; set; }
        public string commonName { get; set; }
    }

    public class RequestListRecognition
    {
        public string _id { get; set; }
        public string recognitionNo { get; set; }
        public string recognitionImageURL { get; set; }
        public string notes { get; set; }
        public string status { get; set; }
        public int __v { get; set; }
        public DateTime created { get; set; }
        public DateTime updated { get; set; }
        public bool isDeleted { get; set; }
        public string recognitionThumbImageURL { get; set; }
        public RequestListPlantId plantId { get; set; }
        public string userId { get; set; }
        public object hrUserId { get; set; }
    }

    public class RequestListModel
    {
        public string status { get; set; }
        public DateTime lastModified { get; set; }
        public List<RequestListRecognition> recognitions { get; set; }
    }
}
