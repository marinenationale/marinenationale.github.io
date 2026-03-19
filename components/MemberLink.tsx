const MemberLink: React.FC<{ image: string; name: string; role?: string }> = ({ image, name, role }) => {
  return (
    <div key={name} className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sky-500 font-semibold">{name}</p>
        <img src={image} alt={`${name}-image`} className="w-24 rounded-md bg-neutral-100 shadow-md dark:bg-neutral-900" />
      </div>
      <p className="text-xs font-medium text-slate-500">{role || 'Member'}</p>
    </div>
  );
};


export default MemberLink;
