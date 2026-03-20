import MemberLink from './MemberLink';

interface GithubMember {
  login: string;
  role: string;
}

function getPortraitPath(login: string): string {
  return `/static/portraits/${login}.png`;
}

const members: GithubMember[] = [
  { login: 'bravocreed', role: 'Project Manager' },
  { login: 'ImperialMaris', role: 'Lead Programmer' }
];

const DisplayMembers = () => {
  return (
    <div className="mt-4 grid grid-cols-2 place-items-center gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {members.map((member) => (
        <MemberLink
          key={member.login}
          image={getPortraitPath(member.login)}
          name={member.login}
          role={member.role}
        />
      ))}
    </div>
  );
};

export default DisplayMembers;
