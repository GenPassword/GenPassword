using PasswordGenerator.Services.Password.Analysis;
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
        private readonly SequentialPatternChecker checker = new();

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
            var isBadPassword = checker.CheckPasswordForBadPattern(password);
            Assert.That(isBadPassword, Is.True);
        }

        [Test]
        [TestCase("aB9$kL2!xZ")]
        [TestCase("x7G!p2Qw#9")]
        [TestCase("M3@kLp9!zX")]
        public void DetectGoodPassword(string password)
        {
            var isBadPassword = checker.CheckPasswordForBadPattern(password);
            Assert.That(isBadPassword, Is.False);
        }

        [Test]
        public void ShouldReturnFoundPatterns()
        {
            var result = checker.FindSequentialPatternInPassword("xxabcdyy1234zz");

            Assert.That(result, Does.Contain("abcd"));
            Assert.That(result, Does.Contain("1234"));
        }
    }
}
