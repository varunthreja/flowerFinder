using System;
namespace FlowerFinder
{
    public static class Constants
    {
        public static string IMAGE_BASE_URL = "http://18.217.174.78:3000/";//profile image url (live)
        public static string BASE_URL = "http://18.217.174.78:3000/api/";//live server

        public static string EMAIL_REGEX = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])";
        public static string VALID_QUANTITY_REGEX = "^[0-9]*$";
        public static string CONTENT_TYPE = "application/json";
    }
}
