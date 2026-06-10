import Image from "next/image";

interface ContactInfoProps {
  icon: string;
  text: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text }) => (
  <div className="flex min-w-0 items-center gap-3.5">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white/10 ring-1 ring-white/10">
      <div className="h-5 w-5">
        <Image width={100} height={100} src={icon} alt="" />
      </div>
    </div>
    <span className="min-w-0 break-words text-[15px] leading-6 text-slate-100/95">
      {text}
    </span>
  </div>
);

export default ContactInfo;
