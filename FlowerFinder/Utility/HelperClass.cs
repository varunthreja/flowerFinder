using System;
using Xamarin.Forms;

namespace FlowerFinder
{
    public class HelperClass
    {
        public HelperClass(){}

        public void SetCookie(string cookie)
        {
            Application.Current.Properties["sessionId"] = cookie;
            Application.Current.SavePropertiesAsync();
        }

        public string GetCookie()
        {
            if (Application.Current.Properties.ContainsKey("sessionId") && Application.Current.Properties["sessionId"].ToString() != "")
            {
                return Application.Current.Properties["sessionId"].ToString();
            }
            else
            {
                return "";
            }
        }
    }
}
