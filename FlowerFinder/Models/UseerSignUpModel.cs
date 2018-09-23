using System;
using System.Collections.Generic;

namespace FlowerFinder
{
    public class UserSignUp
    {
        public int __v { get; set; }
        public string displayName { get; set; }
        public string provider { get; set; }
        public string _id { get; set; }
        public List<object> favoritePlants { get; set; }
        public bool isDeleted { get; set; }
        public bool isActive { get; set; }
        public List<object> loginDevices { get; set; }
        public DateTime created { get; set; }
        public string timeZoneAndUtcOffset { get; set; }
        public List<string> roles { get; set; }
        public string profileImageURL { get; set; }
        public string email { get; set; }
        public string lastName { get; set; }
        public string firstName { get; set; }
    }

    public class UseerSignUpModel
    {
        public UserSignUp user { get; set; }
        public string status { get; set; }
    }
}
