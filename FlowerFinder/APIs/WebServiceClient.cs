using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Xamarin.Forms;
using System.Json;
using Newtonsoft.Json;

namespace FlowerFinder
{
    public class WebServiceClient
    {
        public WebServiceClient() { }
        string token = "Basic YWRtaW46OUVBQkI0RTFCRTU4RDE4RkYxMkM3RDU4Mjc5NjE=";

        public async Task<UserLoginModel> LogUserIn(string uName, string pw)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("email", uName);
            oJsonObject.Add("password", pw);

            IEnumerable<string> cookieStrings = null;

            if (Device.RuntimePlatform == Device.iOS)
            {
                oJsonObject.Add("deviceType", "ios");
            }
            else if (Device.RuntimePlatform == Device.Android)
            {
                oJsonObject.Add("deviceType", "android");
            }
            oJsonObject.Add("deviceToken", "");
            oJsonObject.Add("timeZoneAndUtcOffset", "");

            string url = Constants.BASE_URL + "auth/signin";

            HttpClient oHttpClient = new HttpClient();
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage response = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await response.Content.ReadAsStringAsync();

                var userDetails = JsonConvert.DeserializeObject<UserLoginModel>(responseStr);

                if (userDetails.status != null)
                {
                    if (response.Headers.TryGetValues("set-cookie", out cookieStrings))
                    {
                        foreach (var c in cookieStrings)
                        {
                            var sessionId = c.Split(';');
                            HelperClass helperClass = new HelperClass();
                            helperClass.SetCookie(sessionId[0]);
                        }
                    }
                    return userDetails;
                }
                else
                {
                    userDetails.status = "Fail";
                    return userDetails;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<UseerSignUpModel> SignUpUser(string firstName, string lastName, string userEmail, string userPassword, string provider, string sessionId)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("firstName", firstName);
            oJsonObject.Add("lastName", lastName);
            oJsonObject.Add("email", userEmail);
            oJsonObject.Add("password", userPassword);
            oJsonObject.Add("provider", provider);
            oJsonObject.Add("SessionId", sessionId);

            if (Device.RuntimePlatform == Device.iOS)
            {
                oJsonObject.Add("deviceType", "ios");
            }
            else if (Device.RuntimePlatform == Device.Android)
            {
                oJsonObject.Add("deviceType", "android");
            }
            oJsonObject.Add("deviceToken", "");
            oJsonObject.Add("timeZoneAndUtcOffset", "");

            IEnumerable<string> cookieStrings = null;

            string url = Constants.BASE_URL + "auth/signup";

            HttpClient oHttpClient = new HttpClient();
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage response = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await response.Content.ReadAsStringAsync();

                var userSignUpDetails = JsonConvert.DeserializeObject<UseerSignUpModel>(responseStr);

                if (userSignUpDetails.status != null)
                {
                    if (response.Headers.TryGetValues("set-cookie", out cookieStrings))
                    {
                        foreach (var c in cookieStrings)
                        {
                            var SessionId = c.Split(';');
                            HelperClass helperClass = new HelperClass();
                            helperClass.SetCookie(SessionId[0]);
                        }
                    }
                    return userSignUpDetails;
                }
                else
                {
                    userSignUpDetails.status = "Fail";
                    return userSignUpDetails;
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<string> ForgotPassword(string sessionId, string emailId)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("sessionId", sessionId);
            oJsonObject.Add("email", emailId);

            string url = Constants.BASE_URL + "auth/forgot";

            HttpClient oHttpClient = new HttpClient();
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);

            try
            {
                //UseerSignUpModel userSignUpDetails = null;
                HttpResponseMessage response = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await response.Content.ReadAsStringAsync();
                return responseStr;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<string> ChangePassword(String currentPassword, String newPassword, String verifyPassword, string sessionId)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("currentPassword", currentPassword);
            oJsonObject.Add("newPassword", newPassword);
            oJsonObject.Add("verifyPassword", verifyPassword);

            string url = Constants.BASE_URL + "users/password";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                return responseStr;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<SignOutModel> logOut(string sessionId)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("deviceToken", "");
            if (Device.RuntimePlatform == Device.iOS)
            {
                oJsonObject.Add("deviceType", "ios");
            }
            else if (Device.RuntimePlatform == Device.Android)
            {
                oJsonObject.Add("deviceType", "android");
            }

            string url = Constants.BASE_URL + "auth/signout";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                SignOutModel logOutDetails = null;
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                logOutDetails = JsonConvert.DeserializeObject<SignOutModel>(responseStr);
                if (logOutDetails.status != null)
                {
                    return logOutDetails;
                }
                else
                {
                    logOutDetails.status = "Fail";
                    return logOutDetails;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<ProfileDetailsModel> UpdateProfile(String firstName, String lastName, string phoneNo, string sessionId)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("firstName", firstName);
            oJsonObject.Add("lastName", lastName);
            oJsonObject.Add("phoneNumber", phoneNo);

            string url = Constants.BASE_URL + "users";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PutAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var profileDetails = JsonConvert.DeserializeObject<ProfileDetailsModel>(responseStr);
                if (profileDetails.status != null)
                {
                    return profileDetails;
                }
                else
                {
                    profileDetails.status = "Fail";
                    return profileDetails;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<UserProfileImageUpdateModel> UpdateProfileImage(Plugin.Media.Abstractions.MediaFile image, string sessionId)
        {

            JObject oJsonObject = new JObject();

            var stream = image.GetStream();
            var bytes = new byte[stream.Length];
            await stream.ReadAsync(bytes, 0, (int)stream.Length);
            string base64 = System.Convert.ToBase64String(bytes);

            oJsonObject.Add("file", base64);

            string url = Constants.BASE_URL + "users/uploadPicture";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie

            //MultipartFormDataContent content = new MultipartFormDataContent();
            //content.Add( new StreamContent(image.GetStream()), "\"file\"", $"\"{image.Path}\"");

            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);

            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var profileImageUpdate = JsonConvert.DeserializeObject<UserProfileImageUpdateModel>(responseStr);
                return profileImageUpdate;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<RecognizedFlowerDetailsModel> RecognizeFlower(Plugin.Media.Abstractions.MediaFile image, string sessionId)
        {

            JObject oJsonObject = new JObject();

            var stream = image.GetStream();
            var bytes = new byte[stream.Length];
            await stream.ReadAsync(bytes, 0, (int)stream.Length);
            string base64 = System.Convert.ToBase64String(bytes);

            oJsonObject.Add("file", base64);

            string url = Constants.BASE_URL + "recognitions";
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            if(!string.IsNullOrEmpty(sessionId))
            {
                var cookieData = sessionId.Split('=');
                handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            }
            else
            {
                handler.CookieContainer.Add(uri, new Cookie("sessionId", "")); // Adding a Cookie
            }


            //MultipartFormDataContent content = new MultipartFormDataContent();
            //content.Add(new StreamContent(image.GetStream()), "\"file\"", $"\"{image.Path}\"");

            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);

            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var flowerDetails = JsonConvert.DeserializeObject<RecognizedFlowerDetailsModel>(responseStr);
                return flowerDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<MakeFavouriteModel> markFavourite(string sessionId, string plantId, bool isFavourite)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("plantId", plantId);
            oJsonObject.Add("addToFavourite", isFavourite.ToString());

            string url = Constants.BASE_URL + "plants/favourite";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var flowerDetails = JsonConvert.DeserializeObject<MakeFavouriteModel>(responseStr);
                return flowerDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<RecognizeRequest> HumanRecognizationRequest(string sessionId, string recognitionId)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("status", "Pending Review");

            string url = Constants.BASE_URL + "recognitions/"+recognitionId;
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PutAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var recognizeRequest = JsonConvert.DeserializeObject<RecognizeRequest>(responseStr);
                return recognizeRequest;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<RequestListModel> RequestList(string sessionId, string lastModified)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("lastModified", lastModified);

            string url = Constants.BASE_URL + "user/recognitions";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var requestList = JsonConvert.DeserializeObject<RequestListModel>(responseStr);
                return requestList;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<FavouriteFlowerListModel> FavouriteList(string sessionId, string lastModified)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("lastModified", lastModified);

            string url = Constants.BASE_URL + "favourite/plants";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var favouriteList = JsonConvert.DeserializeObject<FavouriteFlowerListModel>(responseStr);
                return favouriteList;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }


        public async Task<SearchFlowerModel> SearchFlower(string sessionId, string searchText, string pegeNumber)
        {
            JObject oJsonObject = new JObject();
            oJsonObject.Add("perPageCount", "20");
            oJsonObject.Add("pageNumber", pegeNumber);
            oJsonObject.Add("searchText", searchText);

            string url = Constants.BASE_URL + "search/plants";
            var cookieData = sessionId.Split('=');
            Uri uri = new Uri(Constants.BASE_URL);
            HttpClientHandler handler = new HttpClientHandler();
            handler.CookieContainer = new CookieContainer();
            handler.CookieContainer.Add(uri, new Cookie("sessionId", cookieData[1])); // Adding a Cookie
            HttpClient oHttpClient = new HttpClient(handler);
            oHttpClient.DefaultRequestHeaders.Add("Authorization", token);
            try
            {
                HttpResponseMessage responseData = await oHttpClient.PostAsync(url, new StringContent(oJsonObject.ToString(), Encoding.UTF8, Constants.CONTENT_TYPE));
                string responseStr = await responseData.Content.ReadAsStringAsync();
                var searchFlowerList = JsonConvert.DeserializeObject<SearchFlowerModel>(responseStr);
                return searchFlowerList;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }


        //public static Dictionary<string, JsonValue> webserviceCall(String url, String type, Dictionary<String, String> postparameters)
        //{
        //    String postData = "";
        //    string sessionId = "";
        //    Dictionary<string, JsonValue> result = new Dictionary<string, JsonValue> { };
        //    JsonValue jsonWebserviceResult = null;

        //    foreach (String key in postparameters.Keys)
        //    {
        //        //Console.WriteLine("Paramerter key : {0}  keyvalue : {1} ", key, postparameters[key]);

        //        if (key == "sessionId")
        //        {
        //            sessionId = postparameters[key];
        //        }
        //        else
        //        {
        //            postData += key + "=" + postparameters[key] + "&";
        //        }
        //    }
        //    Uri uri = new Uri(url);
        //    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(uri);
        //    request.Timeout = 6 * 10000;
        //    request.Method = type;
        //    request.KeepAlive = true;

        //    request.ContentType = "application/x-www-form-urlencoded";
        //    request.Headers.Add("Authorization", "Basic YWRtaW46OUVBQkI0RTFCRTU4RDE4RkYxMkM3RDU4Mjc5NjE=");

        //    if (sessionId != null && sessionId != "")
        //    {
        //        request.Headers.Add("cookie", sessionId);
        //    }

        //    try
        //    {
        //        if ((type == "POST" || type == "PUT") || type == "DELETE" || type == "GET")
        //        {
        //            byte[] data = Encoding.ASCII.GetBytes(postData);
        //            request.ContentLength = data.Length;
        //            Stream requestStream = request.GetRequestStream();
        //            requestStream.Write(data, 0, data.Length);
        //            requestStream.Close();
        //        }

        //        WebResponse response = request.GetResponse();

        //        string sesstionIdResponse = response.Headers["Set-Cookie"];
        //        if (sesstionIdResponse != null)
        //        {
        //            var session = sesstionIdResponse.Split(';');
        //            result.Add("sessionId", session[0]);
        //        }

        //        using (response)
        //        {
        //            // Get a stream representation of the HTTP web response:
        //            using (Stream stream = response.GetResponseStream())
        //            {
        //                jsonWebserviceResult = JsonObject.Load(stream);
        //                //Console.Out.WriteLine("Response: {0}", jsonWebserviceResult.ToString());
        //            }
        //        }
        //        result.Add("Result", "Success");
        //        result.Add("Message", jsonWebserviceResult);
        //    }
        //    catch (WebException ex)
        //    {
        //        HttpWebResponse response = (HttpWebResponse)ex.Response;
        //        if (response != null)
        //        {
        //            using (response)
        //            {
        //                // Get a stream representation of the HTTP web response:
        //                using (Stream stream = response.GetResponseStream())
        //                {
        //                    jsonWebserviceResult = JsonValue.Load(stream);
        //                }
        //            }
        //            result.Add("Result", "Fail");
        //            result.Add("Message", jsonWebserviceResult);
        //        }
        //        else
        //        {
        //            result.Add("Result", "Fail");
        //            result.Add("ServerDownError", jsonWebserviceResult);
        //        }
        //    }
        //    return result;

        //}

    }
}
