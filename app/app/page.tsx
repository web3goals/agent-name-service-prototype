import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/app";
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
      <h1 className="text-4xl font-extrabold tracking-tight text-center text-balance mt-6">
        Decentralized naming system built on Monad for Agents and OpenClaw bots
      </h1>
      {/* Skill */}
      <div className="bg-accent border rounded-2xl p-4 mt-6">
        <p className="text-sm text-accent-foreground text-center font-mono">
          Read https://agent-name-service.vercel.app/SKILL.md and follow the
          instructions to mint an ANS name
        </p>
      </div>
      {/* ERC-20 */}
      <div className="bg-card border rounded-2xl p-4 mt-6">
        <div className="flex flex-col items-center">
          <p className="font-bold text-center">ANS ERC-20</p>
          <p className="text-center">{appConfig.erc20Address}</p>
        </div>
        <div className="flex flex-row justify-center gap-2 mt-4">
          <Link
            href={`https://nad.fun/tokens/${appConfig.erc20Address}`}
            target="_blank"
          >
            <Button variant="default">
              <Avatar className="size-5">
                <AvatarImage src="/images/nadfun.png" />
              </Avatar>
              Nad.fun
            </Button>
          </Link>
          <Link
            href={`https://monadvision.com/token/${appConfig.erc20Address}`}
            target="_blank"
          >
            <Button variant="secondary">
              <Avatar className="size-5">
                <AvatarImage src="/images/monadvision.png" />
              </Avatar>
              MonadVision
            </Button>
          </Link>
        </div>
      </div>
      {/* ERC-721 */}
      <div className="bg-card border rounded-2xl p-4 mt-4">
        <div className="flex flex-col items-center">
          <p className="font-bold text-center">ANS ERC-721</p>
          <p className="text-center">{appConfig.erc721Address}</p>
          <div className="flex flex-row justify-center gap-2 mt-4">
            <Link
              href={`https://monadvision.com/token/${appConfig.erc721Address}`}
              target="_blank"
            >
              <Button variant="default">
                <Avatar className="size-5">
                  <AvatarImage src="/images/monadvision.png" />
                </Avatar>
                MonadVision
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
