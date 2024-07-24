import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getClientByIdForSuccess } from "@/lib/actions/client.action";
import { formatDateString } from "@/lib/utils";

const RequestSuccess = async ({ params }: any) => {
  const client = await getClientByIdForSuccess(params.id);

  return (
    <div className=" flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Ο <span className="text-green-500">{client?.name}</span> <br />
            καταχωρήθηκε επιτυχώς!
          </h2>
        </section>

        <section className="request-details">
          <p>
            Πήγαινε στο προφιλ του{" "}
            <span className="text-green-500">{client?.name} </span>
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/clients/${client?._id}`}
              className="animate-pulse cursor-pointer hover:scale-105"
            >
              <Image
                src={"/assets/images/success.webp"}
                alt="doctor"
                width={100}
                height={100}
                className="h-16 w-16 rounded-full border border-green-500"
              />
            </Link>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p> {formatDateString(client?.createdAt)}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/booking/${params.id}`}>ΝΕΑ ΚΡΑΤΗΣΗ</Link>
        </Button>

        <p className="copyright">© 2024 Apollon Admin</p>
      </div>
    </div>
  );
};

export default RequestSuccess;
