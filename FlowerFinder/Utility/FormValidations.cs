using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace FlowerFinder
{
    public class FormValidations
    {
        public FormValidations()
        {
        }

        Dictionary<string, string> result = new Dictionary<string, string> { };

        /// <summary>
        /// @param param name="userPassword"
        /// @param name="userEmail"
        /// This method will provide result of validation based on userEmail and password provided 
        /// </summary>
        public Dictionary<string, string> LoginValidation(String userEmail, String userPassword)
        {
            if (userEmail == null || userEmail == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.USER_EMAIL_REQUIRED_MESSAGE);
            }
            else if (userPassword == null || userPassword == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PAASWORD_REQUIRED_MESSAGE);
            }
            else if (!Regex.IsMatch(userEmail, Constants.EMAIL_REGEX))
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.USER_EMAIL_REQUIRED_MESSAGE);
            }
            else
            {
                result.Add("Result", "Success");
                result.Add("Message", "Login Success");
            }
            return result;
        }

        public Dictionary<string, string> signUpValidation(String firstName, String lastName, String userEmail, String userPassword, String confirmPassword)
        {
            if (firstName == null || firstName == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.FIRST_NAME_REQUIRED);
                return result;
            }
            if (lastName == null || lastName == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.LAST_NAME_REQUIRED);
                return result;
            }
            if (userEmail == null || userEmail == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.USER_EMAIL_REQUIRED_MESSAGE);
                return result;
            }
            else if (!Regex.IsMatch(userEmail, Constants.EMAIL_REGEX))
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.USER_EMAIL_REQUIRED_MESSAGE);
                return result;
            }

            if (userPassword == null || userPassword == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PAASWORD_REQUIRED_MESSAGE);
                return result;
            }
            else if (confirmPassword == null || confirmPassword == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.CONFIRM_PASSWORD_REQUIRED);
                return result;
            }
            else if (userPassword.Length < 4)
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PSW_LENGTH);
                return result;
            }
            else if (userPassword.Contains(" ") || confirmPassword.Contains(" "))
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PASSWORD_DOES_NOT_CONTAIN_WHITESPACES);
                return result;
            }
            else if (userPassword != confirmPassword)
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PASSWORD_MATCH_REQUIRED);
                return result;
            }
            else
            {
                result.Add("Result", "Success");
                result.Add("Message", "Login Success");
                return result;
            }
        }

        public Dictionary<string, string> changePasswordValidation(String newPassword, String confirmNewPassword)
        {
            if (newPassword == null || newPassword == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PAASWORD_REQUIRED_MESSAGE);
                return result;
            }
            else if (confirmNewPassword == null || confirmNewPassword == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.CONFIRM_PASSWORD_REQUIRED);
                return result;
            }
            else if (newPassword.Length < 4)
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PSW_LENGTH);
                return result;
            }
            else if (newPassword.Contains(" ") || confirmNewPassword.Contains(" "))
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PASSWORD_DOES_NOT_CONTAIN_WHITESPACES);
                return result;
            }
            else if (newPassword != confirmNewPassword)
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PASSWORD_MATCH_REQUIRED);
                return result;
            }
            else
            {
                result.Add("Result", "Success");
                result.Add("Message", "Change password Successfully");
                return result;
            }
        }


        public Dictionary<string, string> forgotPasswordValidation(String userEmail)
        {
            if (userEmail == null || userEmail == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.USER_EMAIL_REQUIRED_MESSAGE);
            }
            else if (!Regex.IsMatch(userEmail, Constants.EMAIL_REGEX))
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.USER_EMAIL_REQUIRED_MESSAGE);
            }
            else
            {
                result.Add("Result", "Success");
                result.Add("Message", "Login Success");
            }
            return result;
        }

        public Dictionary<string, string> updateProfileValidation(String firstName, String lastName, String phoneNo)
        {
            if (firstName == null || firstName == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.FIRST_NAME_REQUIRED);
                return result;
            }
            if (lastName == null || lastName == "")
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.LAST_NAME_REQUIRED);
                return result;
            }

            if ((phoneNo != null && phoneNo != "") && (!Regex.IsMatch(phoneNo, Constants.VALID_QUANTITY_REGEX)))
            {
                result.Add("Result", "Fail");
                result.Add("Message", Messages.PHONE_NUMBER_MATCH_REQUIRED);
                return result;
            }
            else
            {
                result.Add("Result", "Success");
                result.Add("Message", "Profile Updated Successfully");
                return result;
            }
        }
    }
}
