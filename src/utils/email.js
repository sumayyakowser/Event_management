exports.sendEmail = async (userId, eventTitle) => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`📧 Email sent to user ${userId} for event "${eventTitle}"`);
        resolve();
      }, 500);
    });
  };
  