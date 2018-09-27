using System;
using Plugin.SecureStorage;
using Xamarin.Forms;

namespace FlowerFinder
{
    public class HelperClass
    {
        public HelperClass(){}

        public void SetCookie(string cookie)
        {
            CrossSecureStorage.Current.SetValue("sessionId", cookie);
        }

        public string GetCookie()
        {
            if (CrossSecureStorage.Current.HasKey("sessionId") && CrossSecureStorage.Current.GetValue("sessionId").ToString() != "")
            {
                return CrossSecureStorage.Current.GetValue("sessionId");
            }
            else
            {
                return "";
            }
        }
    }
}
