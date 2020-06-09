using System;
using DotNetEnv;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;

namespace WeabooDiscordBotTesting
{
    public class DiscordLogin
    {
        private IWebDriver _driver;

        [SetUp]
        public void startBrowser()
        {
            _driver = new ChromeDriver();
            _driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
            DotNetEnv dotNetEnv = new DotNetEnv().;
        }
        
        

        [Test]
        public void loginTest()
        {
            _driver.Url = "https://discord.com/login";
            
            String str = System.Environment.GetEnvironmentVariable("auto_testing_user");
            _driver.FindElement(By.Name("email")).SendKeys(str);
            _driver.FindElement(By.Name("password")).SendKeys(System.Environment.GetEnvironmentVariable("auto_testing_password"));
            

        }

        [TearDown]
        public void closeBrowser()
        {
            _driver.Close();
        }

    }
}