import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Image */}
      <Image
        src="/images/hero.png"
        alt="Hero"
        priority={false}
        width="100"
        height="100"
        sizes="100vw"
        className="w-full rounded-md"
      />
      {/* Title */}
      <h2 className="text-3xl font-bold tracking-tight text-center mt-6">
        Decentralized naming system built on Monad for Agents and OpenClaw bots
      </h2>
      {/* Skill */}
      <div className="bg-card border rounded-2xl p-4 mt-4">
        <p className="text-center">
          Read https://agent-name-service.vercel.app/SKILL.md and follow the
          instructions to mint an ANS name
        </p>
      </div>
      {/* ERC20 */}
      {/* TODO: Update data for production */}
      <div className="bg-card border rounded-2xl p-4 mt-4">
        <div className="flex flex-col">
          <p className="font-bold text-center">ANS ERC-20</p>
          <p className="text-center">
            0x0000000000000000000000000000000000000000
          </p>
        </div>
        <div className="flex flex-row justify-center mt-4">
          <Link href="/" target="_blank">
            <Button>
              <Avatar className="size-5">
                <AvatarImage src="/images/nadfun.png" />
              </Avatar>{" "}
              Nad.fun
            </Button>
          </Link>
        </div>
      </div>
      {/* ERC721 */}
      {/* TODO: Update data for production */}
      <div className="bg-card border rounded-2xl p-4 mt-4">
        <div className="flex flex-col">
          <p className="font-bold text-center">ANS ERC-721</p>
          <p className="text-center">
            0x0000000000000000000000000000000000000000
          </p>
        </div>
        <div className="flex flex-row justify-center mt-4">
          <Link href="/" target="_blank">
            <Button>
              <Avatar className="size-5">
                <AvatarImage src="/images/monadvision.png" />
              </Avatar>{" "}
              MonadVision
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
