import { useState, useEffect } from 'react';
import MemberLink from './MemberLink';

interface GithubMember {
  login: string;
  avatar_url: string;
}

interface MemberData {
  data: GithubMember[];
  etag: string | null;
  timestamp: number;
}

const cacheKey = 'marinenationaleMembers';
const cacheExpiry = 24 * 60 * 60 * 1000;

function getPortraitPath(login: string): string {
  return `/static/portraits/${login}.png`;
}

const memberRoles: Record<string, string> = {
  bravocreed: 'Project Manager',
  ImperialMaris: 'Lead Programmer'
};

const priorityOrder = ['ImperialMaris', 'bravocreed'];

const fallbackMembers: GithubMember[] = [
  { login: 'bravocreed', avatar_url: 'https://github.com/Bravomanbravo212.png' },
  { login: 'ImperialMaris', avatar_url: 'https://github.com/khaosen.png' }
];

function getEmptyMemberData(): MemberData {
  return {
    data: [],
    etag: null,
    timestamp: 0,
  };
}

async function FetchMembers() {
  const raw = localStorage.getItem(cacheKey);
  let members: MemberData = getEmptyMemberData();

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<MemberData>;
      members = {
        data: Array.isArray(parsed.data) ? parsed.data : [],
        etag: parsed.etag || null,
        timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : 0,
      };
    } catch {
      members = getEmptyMemberData();
    }
  }

  const isCacheExpired = members.timestamp ? new Date().getTime() - members.timestamp > cacheExpiry : true;

  if (!isCacheExpired) {
    console.log('Using cached members data:', members.data);
    return members;
  }

  const headers: Record<string, string> = {};
  if (members.etag) headers['If-None-Match'] = members.etag;

  const response = await fetch(`https://api.github.com/orgs/marinenationale/members`, { headers });

  if (response.status === 304) return members;

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('GitHub members API did not return a member list.');
  }

  members.data = payload;
  members.etag = response.headers.get('ETag');
  members.timestamp = new Date().getTime();

  members.data = [
    ...priorityOrder
      .map((login) => {
        const foundMember = members.data.find((member) => member.login === login);
        if (!foundMember) {
          console.warn(`Member ${login} not found in API response`);
        }
        return foundMember;
      })
      .filter((member): member is GithubMember => !!member),
    ...members.data.filter((member) => !priorityOrder.includes(member.login)),
  ];

  console.log('Sorted members data:', members.data);

  localStorage.setItem(cacheKey, JSON.stringify(members));
  console.log(`Fetched, sorted, and cached data (etag ${members.etag})`, members.timestamp);

  return members;
}

const DisplayMembers = () => {
  const [members, setMembers] = useState<MemberData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fetched = await FetchMembers();
        if (!fetched.data.length) {
          setMembers({ ...fetched, data: fallbackMembers });
          return;
        }

        setMembers(fetched);
      } catch {
        setMembers({ data: fallbackMembers, etag: null, timestamp: Date.now() });
        setError(true);
      }
    })();
  }, []);

  return (
    <>
      {!members && <p className="mt-4 text-sm text-slate-500">Loading members...</p>}
      {error && <p className="mt-4 text-sm text-slate-500">Using fallback member list right now.</p>}
      {!!members?.data?.length && (
        <div className="mt-4 grid grid-cols-2 place-items-center gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {members.data.map((member) => (
            <MemberLink
              key={member.login}
              image={getPortraitPath(member.login)}
              name={member.login}
              role={memberRoles[member.login] || 'Member'}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default DisplayMembers;
