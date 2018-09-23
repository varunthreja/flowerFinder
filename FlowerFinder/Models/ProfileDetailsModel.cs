using System;
using System.Collections.Generic;

namespace FlowerFinder
{
    public class User
    {
        public DateTime updated { get; set; }
        public int phoneNumber { get; set; }
        public string _id { get; set; }
        public string displayName { get; set; }
        public string provider { get; set; }
        public int __v { get; set; }
        public DateTime resetPasswordExpires { get; set; }
        public string resetPasswordToken { get; set; }
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

    public class ProfileDetailsModel
    {
        public string status { get; set; }
        public User user { get; set; }
        public string message { get; set; }
    }

    public class ImageUpdate
    {
        public string _id { get; set; }
        public string displayName { get; set; }
        public string provider { get; set; }
        public int __v { get; set; }
        public DateTime resetPasswordExpires { get; set; }
        public string resetPasswordToken { get; set; }
        public object phoneNumber { get; set; }
        public DateTime updated { get; set; }
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

    public class UserProfileImageUpdateModel
    {
        public string status { get; set; }
        public ImageUpdate user { get; set; }
    }
}
