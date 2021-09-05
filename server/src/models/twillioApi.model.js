require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const managentNotifications = require("./managentNotifications.mongo");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const notiftyNewLaunchSms = async (launch) => {
  try {
    const mangementDetails = await getAllMangementDetails();

    const smsText = `  Launch detials : 
        mission: ${launch.mission},
        rocket name: ${launch.rocket},
        customers : ${launch.customers}
        `;

    mangementDetails.forEach(async (personDetails) => {
      const message = await client.messages.create({
        body: smsText,
        from: "+16692018386",
        to: personDetails.phoneNumber,
      });
      console.log(message.status);
    });
  } catch (error) {
    console.error(error);
  }
};

const notifyNewLaunchEmail = async (launch) => {
  try {
    const mangementDetails = await getAllMangementDetails();

    mangementDetails.forEach(async (personDetails) => {
      const text = `${personDetails.name} There is new launch!
        Launch detials : <br>
        mission: ${launch.mission}, <br>
        rocket name: ${launch.rocket}, <br>
        customers : ${launch.customers} <br>
        `;

      const msg = {
        to: personDetails.email,
        from: "almogco94@gmail.com",
        subject: `Launch number ${launch.flightNumber} is started in date ${launch.launchDate}`,
        html: `<strong>${text}</strong>`,
      };

      const message = await sgMail.send(msg);
      console.log("Email sent");
    });

    //   sgMail
    //     .send(msg)
    //     .then(() => {
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
  } catch (error) {
    console.error(error);
  }
};

const getAllMangementDetails = async () => {
  return await managentNotifications.find({});
};

module.exports = {
  notifyNewLaunchEmail,
  notiftyNewLaunchSms,
};

//   const person = {
//     name: "Sigalit",
//     phoneNumber: "+97254473662",
//     email: "almogco94@gmail.com",
//   };

//   await managentNotifications.findOneAndUpdate(
//     {
//       email: person.email,
//     },
//     person,
//     {
//       upsert: true,
//     }
//   );
