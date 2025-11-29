import Image from "next/image";
import { Name } from "./name";

interface CardProfileProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    username: string | null;
    bio: string | null;
    image: string | null;
  };
}

export function CardProfile({ user }: CardProfileProps) {
  return (
    <section className="w-full flex flex-col items-center mx-auto px-4">
      <div className="">
        <Image
          src={user.image ?? ""}
          alt="Foto do perfil"
          width={104}
          height={104}
          className="rounded-full bg-gray-50 object-cover border-white hover:shadow-xl duration-300"
          priority
          quality={100}
        />
      </div>
      <div>
        <Name initialName={user.name ?? "Digite seu nome..."} />
      </div>
    </section>
  );
}
