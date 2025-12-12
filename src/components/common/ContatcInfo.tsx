import Image from "next/image";

interface ContactInfoProps {
  icon: string;
  text: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text }) => (
  <div className="flex flex-row items-center gap-3">
    <div className="w-5 h-5">
      <Image width={100} height={100} src={icon} alt="icon" />
    </div>
    <span className="text-sm text-slate-100">{text}</span>
  </div>
);

export default ContactInfo;
