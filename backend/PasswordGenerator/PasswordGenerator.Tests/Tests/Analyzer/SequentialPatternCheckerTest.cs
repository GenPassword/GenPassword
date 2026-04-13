using Microsoft.AspNetCore.Identity;
using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Validator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PasswordGenerator.Tests.Tests.Analyzer
{
    [TestFixture]
    public class SequentialPatternCheckerTest
    {
        private IPasswordValidator passwordValidaror;

        [SetUp]
        public void Setup()
        {
            var checker = new SequentialPatternChecker();
            var repeat = new RepetitionPatternChecker();
            var patternRule = new SequentialRule(checker);
            var repeatRule = new RepetitionRule(repeat);
            var rules = new List<IPasswordRule>() { patternRule, repeatRule };
            passwordValidaror = new PasswordValidator(rules);
        }

        [Test]
        [TestCase("15qwerty")]
        [TestCase("as1234r")]
        [TestCase("gbnABCDkmnbh")]
        [TestCase("QwErTy")]
        [TestCase("AbCd")]
        [TestCase("4321")]
        [TestCase("dcba")]
        public void DetectBadPassword(string password)
        {
            var isBadPassword = passwordValidaror.IsInvalidPassword(password);
            Assert.That(isBadPassword, Is.True);
        }

        [Test]
        [TestCase("aB9$kL2!xZ")]
        [TestCase("x7G!p2Qw#9")]
        [TestCase("M3@kLp9!zX")]
        public void DetectGoodPassword(string password)
        {
            var isBadPassword = passwordValidaror.IsInvalidPassword(password);
            Assert.That(isBadPassword, Is.False);
        }

        [Test]
        [TestCase("111DASN")]
        [TestCase("nzxjkcAAAkasl")]
        [TestCase("jk&&&ja")]
        public void DetectRepeatInPassword(string password)
        {
            var isBadPassword = passwordValidaror.IsInvalidPassword(password);
            Assert.That(isBadPassword, Is.True);
        }
    }
}
