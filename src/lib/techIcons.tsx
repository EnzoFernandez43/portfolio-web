import { FaReact, FaNodeJs, FaHtml5, FaDatabase, FaJava } from 'react-icons/fa';
import { SiTypescript, SiExpress, SiPostgresql, SiMongodb, SiFirebase,
         SiTailwindcss, SiSocketdotio, SiCss, SiJavascript, SiNextdotjs,
         SiPrisma, SiDocker, SiSpring } from 'react-icons/si';
import { ReactElement } from 'react';

const iconMap: Record<string, ReactElement> = {
    'React':       <FaReact size={22} />,
    'TypeScript':  <SiTypescript size={22} />,
    'Node.js':     <FaNodeJs size={22} />,
    'MongoDB':     <SiMongodb size={22} />,
    'PostgreSQL':  <SiPostgresql size={22} />,
    'Express':     <SiExpress size={22} />,
    'Firebase':    <SiFirebase size={22} />,
    'Tailwind':    <SiTailwindcss size={22} />,
    'Socket.io':   <SiSocketdotio size={22} />,
    'HTML':        <FaHtml5 size={22} />,
    'CSS':         <SiCss size={22} />,
    'JavaScript':  <SiJavascript size={22} />,
    'Next.js':     <SiNextdotjs size={22} />,
    'Prisma':      <SiPrisma size={22} />,
    'Docker':      <SiDocker size={22} />,
    'Java':        <FaJava size={22} />,
    'Spring Boot': <SiSpring size={22} />,
    'SQL':         <FaDatabase size={22} />,
};

export function getTechIcon(tech: string): ReactElement {
    return iconMap[tech] ?? <FaDatabase size={22} />;
}