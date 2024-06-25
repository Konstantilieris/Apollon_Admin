/* eslint-disable camelcase */
"use server";

import { connectToDatabase } from "../mongoose";
import Booking from "@/database/models/booking.model";

import { formatTime } from "../utils";

import Room from "@/database/models/room.model";
import { revalidatePath } from "next/cache";
import Client from "@/database/models/client.model";
import { DateRange } from "react-day-picker";
import Appointment from "@/database/models/event.model";
import Service from "@/database/models/service.model";

interface ICreateBooking {
  clientId_string: string;
  fromDate: Date;
  toDate: Date;
  totalprice: Number | undefined;
  path: string;

  bookingData: any;
  flag1: boolean;
  flag2: boolean;
}

export async function createBooking({
  clientId_string,
  fromDate,
  toDate,

  totalprice,
  path,
  flag1,
  flag2,
  bookingData,
}: ICreateBooking) {
  try {
    connectToDatabase();

    const selectedDogsFiltered = bookingData.map(
      ({ dogId, dogName, roomId }: any) => ({
        dogId,
        dogName,
        roomId,
      })
    );
    // eslint-disable-next-line no-unused-vars
    const booking = await Booking.create({
      clientId: clientId_string,
      fromDate,
      toDate,
      totalAmount: totalprice,
      flag1,
      flag2,
      dogs: selectedDogsFiltered,
    });
    if (booking) {
      try {
        for (const item of selectedDogsFiltered) {
          await Room.findByIdAndUpdate(
            { _id: item.roomId },
            { $addToSet: { currentBookings: booking._id } }
          );
        }
      } catch (error) {
        console.log(error);
      }

      const service = await Service.create({
        serviceType: "ΔΙΑΜΟΝΗ",
        amount: totalprice,
        clientId: clientId_string,
        bookingId: booking._id,
        date: fromDate,
      });
      if (service) {
        const client = await Client.findOneAndUpdate(
          { _id: booking.clientId }, // Find the client document by _id
          { $push: { owes: service._id } }, // Push the service object onto the owes array
          { new: true } // Return the updated document after the update operation
        );
        if (!client) {
          throw new Error("Client not found");
        } else {
          if (flag1) {
            const pickUpDescription = `${client.phone.mobile} -${
              client.location.city
            }-${client.residence}-${client.location.address}-${
              client.location.postalCode
            } - ${selectedDogsFiltered
              .map(({ dogName }: any) => `${dogName}`)
              .join(", ")} - ΠΑΡΑΛΑΒΗ`;
            const pickUpAppointment = await Appointment.create({
              Id: booking._id, // Use the training _id as the event Id
              Type: "ΠΑΡΑΛΑΒΗ",
              Subject: `${client.lastName} - ΜΕΤΑΦΟΡΑ`,
              Description: pickUpDescription,
              StartTime: fromDate,
              EndTime: fromDate,
            });
            if (!pickUpAppointment) {
              throw new Error("Failed to create pick up appointment");
            }
          } else {
            const ArrivalDescription = `${client.phone.mobile} - ${
              client.notes
            }- ${selectedDogsFiltered
              .map(({ dogName }: any) => `${dogName}`)
              .join(", ")}`;
            const ArrivalAppointment = await Appointment.create({
              Id: booking._id, // Use the training _id as the event Id
              Type: "ΑΦΙΞΗ",
              Subject: `${client.lastName} - ΑΦΙΞΗ ΣΚΥΛΟΥ `,
              Description: ArrivalDescription,
              StartTime: fromDate,
              EndTime: fromDate,
            });
            if (!ArrivalAppointment) {
              throw new Error("Failed to create Arrival appointment");
            }
          }
          if (flag2) {
            const deliveryDescription = `${client.phone.mobile} -${
              client.location.city
            }-${client.residence}-${client.location.address}-${
              client.location.postalCode
            } - ${selectedDogsFiltered
              .map(({ dogName }: any) => `${dogName}`)
              .join(", ")} - ΠΑΡΑΔΟΣΗ`;
            const deliveryAppointment = await Appointment.create({
              Id: booking._id, // Use the training _id as the event Id
              Type: "ΠΑΡΑΔΟΣΗ",
              Subject: `${client.lastName} - ΜΕΤΑΦΟΡΑ`,
              Description: deliveryDescription,
              StartTime: toDate,
              EndTime: toDate,
            });
            if (!deliveryAppointment) {
              throw new Error("Failed to create delivery appointment");
            }
          } else {
            const DepartureDescription = `${client.phone.mobile} - ${
              client.notes
            }- ${selectedDogsFiltered
              .map(({ dogName }: any) => `${dogName}`)
              .join(", ")}`;
            const DepartureAppointment = await Appointment.create({
              Id: booking._id, // Use the training _id as the event Id
              Type: "ΑΝΑΧΩΡΗΣΗ",
              Subject: `${client.lastName} - ΑΝΑΧΩΡΗΣΗ ΣΚΥΛΟΥ`,
              Description: DepartureDescription,
              StartTime: toDate,
              EndTime: toDate,
            });
            if (!DepartureAppointment) {
              throw new Error("Failed to create Departure appointment");
            }
          }
        }
      }
      revalidatePath(path);
      return JSON.stringify(booking);
    }
  } catch (error) {
    console.log("Failed to create booking", error);
    throw error;
  }
}
export async function editBookingDate(id: string, rangeDate: DateRange) {
  if (!rangeDate.to || !rangeDate.from) {
    return;
  }
  try {
    connectToDatabase();
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        fromDate: rangeDate.from,
        toDate: rangeDate.to,
      },
      { new: true }
    );
    if (!updatedBooking) {
      throw new Error("Booking not found");
    } else {
      await Service.findOne({
        bookingId: updatedBooking._id,
        date: updatedBooking.fromDate,
      });

      if (updatedBooking.flag) {
        const pickUpAppointment = JSON.parse(
          JSON.stringify(
            await Appointment.findOne({
              Id: updatedBooking._id,
              Type: "ΠΑΡΑΛΑΒΗ",
            })
          )
        );
        const deliveryAppointment = JSON.parse(
          JSON.stringify(
            await Appointment.findOne({
              Id: updatedBooking._id,
              Type: "ΠΑΡΑΔΟΣΗ",
            })
          )
        );
        if (pickUpAppointment && deliveryAppointment) {
          const pickUpStartTime = new Date(rangeDate.from);
          const pickUpEndTime = new Date(rangeDate.from);
          const deliveryStartTime = new Date(rangeDate.to);
          const deliverEndTime = new Date(rangeDate.to);
          pickUpStartTime.setHours(
            parseInt(updatedBooking.timeArrival.split(":")[0], 10),
            parseInt(updatedBooking.timeArrival.split(":")[1], 10)
          );
          pickUpEndTime.setHours(
            parseInt(updatedBooking.timeArrival.split(":")[0], 10),
            parseInt(updatedBooking.timeArrival.split(":")[1], 10)
          );
          deliveryStartTime.setHours(
            parseInt(updatedBooking.timeDeparture.split(":")[0], 10),
            parseInt(updatedBooking.timeDeparture.split(":")[1], 10)
          );
          deliverEndTime.setHours(
            parseInt(updatedBooking.timeDeparture.split(":")[0], 10),
            parseInt(updatedBooking.timeDeparture.split(":")[1], 10)
          );
          await Appointment.findByIdAndUpdate(pickUpAppointment._id, {
            StartTime: pickUpStartTime,
            EndTime: pickUpEndTime,
          });
          await Appointment.findByIdAndUpdate(deliveryAppointment._id, {
            StartTime: deliveryStartTime,
            EndTime: deliverEndTime,
          });
        }
      } else {
        const ArrivalAppointment = JSON.parse(
          JSON.stringify(
            await Appointment.findOne({ Id: updatedBooking._id, Type: "ΑΦΙΞΗ" })
          )
        );
        const DepartureAppointment = JSON.parse(
          JSON.stringify(
            await Appointment.findOne({
              Id: updatedBooking._id,
              Type: "ΑΝΑΧΩΡΗΣΗ",
            })
          )
        );
        if (ArrivalAppointment && DepartureAppointment) {
          const ArrivalStartTime = new Date(rangeDate.from);
          const ArrivalEndTime = new Date(rangeDate.from);
          ArrivalStartTime.setHours(
            parseInt(updatedBooking.timeArrival.split(":")[0], 10),
            parseInt(updatedBooking.timeArrival.split(":")[1], 10)
          );
          ArrivalEndTime.setHours(
            parseInt(updatedBooking.timeArrival.split(":")[0], 10),
            parseInt(updatedBooking.timeArrival.split(":")[1], 10)
          );
          const DepartureStartTime = new Date(rangeDate.to);
          const DepartureEndTime = new Date(rangeDate.to);
          DepartureStartTime.setHours(
            parseInt(updatedBooking.timeDeparture.split(":")[0], 10),
            parseInt(updatedBooking.timeDeparture.split(":")[1], 10)
          );
          DepartureEndTime.setHours(
            parseInt(updatedBooking.timeDeparture.split(":")[0], 10),
            parseInt(updatedBooking.timeDeparture.split(":")[1], 10)
          );
          await Appointment.findByIdAndUpdate(ArrivalAppointment._id, {
            StartTime: ArrivalStartTime,
            EndTime: ArrivalEndTime,
          });
          await Appointment.findByIdAndUpdate(DepartureAppointment._id, {
            StartTime: DepartureStartTime,
            EndTime: DepartureEndTime,
          });
        }
      }
    }
    revalidatePath("/calendar");
    revalidatePath("/createbooking");
    return JSON.stringify(updatedBooking);
  } catch (error) {
    console.log(error);
  }
}
export async function editBookingArrival(
  id: string,
  timeArrival: Date | undefined
) {
  if (!timeArrival) {
    return;
  }
  try {
    connectToDatabase();
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { timeArrival: formatTime(timeArrival, "el") },
      { new: true }
    );
    if (!updatedBooking) {
      throw new Error("Booking not found");
    }
    if (updatedBooking.flag) {
      const pickUpAppointment = JSON.parse(
        JSON.stringify(
          await Appointment.findOne({
            Id: updatedBooking._id,
            Type: "ΠΑΡΑΛΑΒΗ",
          })
        )
      );
      const deliveryAppointment = JSON.parse(
        JSON.stringify(
          await Appointment.findOne({
            Id: updatedBooking._id,
            Type: "ΠΑΡΑΔΟΣΗ",
          })
        )
      );
      if (pickUpAppointment && deliveryAppointment) {
        const pickUpStartTime = new Date(updatedBooking.fromDate);
        const pickUpEndTime = new Date(updatedBooking.fromDate);

        pickUpStartTime.setHours(
          parseInt(formatTime(timeArrival, "el").split(":")[0], 10),
          parseInt(formatTime(timeArrival, "el").split(":")[1], 10)
        );
        pickUpEndTime.setHours(
          parseInt(formatTime(timeArrival, "el").split(":")[0], 10),
          parseInt(formatTime(timeArrival, "el").split(":")[1], 10)
        );

        await Appointment.findByIdAndUpdate(pickUpAppointment._id, {
          StartTime: pickUpStartTime,
          EndTime: pickUpEndTime,
        });
      }
    } else {
      const ArrivalAppointment = JSON.parse(
        JSON.stringify(
          await Appointment.findOne({ Id: updatedBooking._id, Type: "ΑΦΙΞΗ" })
        )
      );

      if (ArrivalAppointment) {
        const ArrivalStartTime = new Date(updatedBooking.fromDate);
        const ArrivalEndTime = new Date(updatedBooking.fromDate);
        ArrivalStartTime.setHours(
          parseInt(formatTime(timeArrival, "el").split(":")[0], 10),
          parseInt(formatTime(timeArrival, "el").split(":")[1], 10)
        );
        ArrivalEndTime.setHours(
          parseInt(formatTime(timeArrival, "el").split(":")[0], 10),
          parseInt(formatTime(timeArrival, "el").split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(ArrivalAppointment._id, {
          StartTime: ArrivalStartTime,
          EndTime: ArrivalEndTime,
        });
      }
    }
    revalidatePath("/calendar");
    revalidatePath("/createbooking");
    return JSON.stringify(updatedBooking);
  } catch (error) {
    console.log(error);
  }
}
export async function editBookingDeparture(
  id: string,
  timeDeparture: Date | undefined
) {
  if (!timeDeparture) {
    return;
  }
  try {
    connectToDatabase();
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { timeDeparture: formatTime(timeDeparture, "el") },
      { new: true }
    );
    if (!updatedBooking) {
      throw new Error("Booking not found");
    }
    if (updatedBooking.flag) {
      const deliveryAppointment = JSON.parse(
        JSON.stringify(
          await Appointment.findOne({
            Id: updatedBooking._id,
            Type: "ΠΑΡΑΔΟΣΗ",
          })
        )
      );

      if (deliveryAppointment) {
        const deliveryStartTime = new Date(updatedBooking.toDate);
        const deliverEndTime = new Date(updatedBooking.toDate);
        deliveryStartTime.setHours(
          parseInt(formatTime(timeDeparture, "el").split(":")[0], 10),
          parseInt(formatTime(timeDeparture, "el").split(":")[1], 10)
        );
        deliverEndTime.setHours(
          parseInt(formatTime(timeDeparture, "el").split(":")[0], 10),
          parseInt(formatTime(timeDeparture, "el").split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(deliveryAppointment._id, {
          StartTime: deliveryStartTime,
          EndTime: deliverEndTime,
        });
      }
    } else {
      const DepartureAppointment = JSON.parse(
        JSON.stringify(
          await Appointment.findOne({
            Id: updatedBooking._id,
            Type: "ΑΝΑΧΩΡΗΣΗ",
          })
        )
      );
      if (DepartureAppointment) {
        const DepartureStartTime = new Date(updatedBooking.toDate);
        const DepartureEndTime = new Date(updatedBooking.toDate);
        DepartureStartTime.setHours(
          parseInt(formatTime(timeDeparture, "el").split(":")[0], 10),
          parseInt(formatTime(timeDeparture, "el").split(":")[1], 10)
        );
        DepartureEndTime.setHours(
          parseInt(formatTime(timeDeparture, "el").split(":")[0], 10),
          parseInt(formatTime(timeDeparture, "el").split(":")[1], 10)
        );
        await Appointment.findByIdAndUpdate(DepartureAppointment._id, {
          StartTime: DepartureStartTime,
          EndTime: DepartureEndTime,
        });
      }
    }
    revalidatePath("/calendar");
    revalidatePath("/createbooking");
    return JSON.stringify(updatedBooking);
  } catch (error) {
    console.log(error);
  }
}
export async function getBookingById(bookingId: string) {
  try {
    connectToDatabase();
    const booking = await Booking.findById(bookingId).populate([
      {
        path: "clientId",
        model: Client,
        select: "firstName lastName dog.name",
      },
    ]);

    if (!booking) {
      throw new Error("Booking not found");
    }

    return JSON.stringify(booking);
  } catch (error) {
    console.error("Failed to retrieve booking:", error);
    throw error;
  }
}
export async function findBookingsWithinDateRange(rangeDate: DateRange) {
  try {
    connectToDatabase();
    const bookings = await Booking.find({
      $or: [
        {
          $and: [
            { fromDate: { $lte: rangeDate.to } },
            { toDate: { $gte: rangeDate.to } },
          ],
        },
        {
          $and: [
            { fromDate: { $lte: rangeDate.from } },
            { toDate: { $gte: rangeDate.from } },
          ],
        },
        {
          $and: [
            { fromDate: { $gte: rangeDate.from } },
            { toDate: { $lte: rangeDate.to } },
          ],
        },
      ],
    });

    return JSON.stringify(bookings);
  } catch (error) {
    console.error("Error finding bookings within date range:", error);
    throw error;
  }
}
export async function editBookingRooms(id: string, bookingData: any) {
  try {
    connectToDatabase();

    // Retrieve the old booking
    const oldBooking = JSON.parse(JSON.stringify(await Booking.findById(id)));
    if (!oldBooking) {
      throw new Error("Booking not found");
    }

    // Iterate over each dog in the old booking
    for (const dog of oldBooking.dogs) {
      // Check if the dog is included in the new booking data
      const newData = bookingData.find((item: any) => item.dogId === dog.dogId);
      if (newData && newData.roomId !== dog.roomId.toString()) {
        // Remove booking ID from the old room's currentBookings array
        if (dog.roomId) {
          await Room.findByIdAndUpdate(dog.roomId, {
            $pull: { currentBookings: id },
          });
        }

        // Add booking ID to the new room's currentBookings array
        await Room.findByIdAndUpdate(newData.roomId, {
          $addToSet: { currentBookings: id },
        });

        // Update the dog's room ID
        dog.roomId = newData.roomId;
      }
    }

    // Update the booking's dogs array
    const newDogs = oldBooking.dogs.map((dog: any) => {
      const newData = bookingData.find((data: any) => data.dogId === dog.dogId);
      if (newData && newData.roomId !== dog.roomId.toString()) {
        return { ...dog, roomId: newData.roomId };
      }
      return dog;
    });

    // Save the updated booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { dogs: newDogs },
      { new: true }
    );
    return JSON.parse(JSON.stringify(updatedBooking)); // Return the updated booking
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while updating the booking." };
  }
}

export async function clientBookings(clientId: string) {
  try {
    connectToDatabase();

    const bookings = await Booking.find({ clientId });
    return bookings;
  } catch (error) {
    console.error("Error retrieving bookings for client:", error);
    throw error;
  }
}

export async function deleteBooking(id: string) {
  try {
    connectToDatabase();
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    for (const dog of booking.dogs) {
      await Room.findByIdAndUpdate(dog.roomId, {
        $pull: { currentBookings: id },
      });
    }

    revalidatePath("/createbooking");
    return JSON.parse(JSON.stringify(booking));
  } catch (error) {
    console.error("Failed to delete booking:", error);
    throw error;
  }
}
export async function checkExistingBooking({ rangeDate, clientId }: any) {
  try {
    connectToDatabase();
    if (!rangeDate.from || !rangeDate.to) {
      return false;
    }
    const existingBooking = await Booking.findOne({
      clientId,
      $or: [
        {
          $and: [
            { fromDate: { $lte: rangeDate.to } }, // Booking starts before or on rangeDate.toDate
            { toDate: { $gte: rangeDate.to } }, // Booking ends after or on rangeDate.toDate
          ],
        },
        {
          $and: [
            { fromDate: { $lte: rangeDate.from } }, // Booking starts before or on rangeDate.fromDate
            { toDate: { $gte: rangeDate.from } }, // Booking ends after or on rangeDate.fromDate
          ],
        },
        {
          $and: [
            { fromDate: { $gte: rangeDate.from } }, // Booking starts after or on rangeDate.fromDate
            { toDate: { $lte: rangeDate.to } }, // Booking ends before or on rangeDate.toDate
          ],
        },
      ],
    });
    if (existingBooking) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to check booking:", error);
    throw error;
  }
}

export async function countBookingsByMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Initialize an object to store the counts for each month
  const bookingsByMonth = [];

  // Loop through each month of the current year
  for (let month = 0; month < currentDate.getMonth() + 1; month++) {
    // Set the start date of the current month
    const startDateOfMonth = new Date(currentYear, month, 1);

    // Calculate the end date of the current month
    const endDateOfMonth = new Date(currentYear, month + 1, 0, 23, 59, 59);

    try {
      connectToDatabase();
      const count = await Booking.countDocuments({
        fromDate: { $gte: startDateOfMonth, $lte: endDateOfMonth },
      });

      // Store the count for the current month
      bookingsByMonth.push({
        month: startDateOfMonth.toLocaleString("en-US", { month: "long" }),
        count,
      });
    } catch (error) {
      console.error(
        `Error counting bookings for ${startDateOfMonth.toLocaleString(
          "el-GR",
          { month: "long" }
        )}:`,
        error
      );
    }
  }

  return bookingsByMonth;
}
