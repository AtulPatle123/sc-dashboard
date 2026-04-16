import React from "react";
import {
  SiRedis,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiApachecassandra,
  SiRabbitmq,
  SiApachekafka,
  SiElasticsearch,
} from "react-icons/si";
import { FaDatabase, FaServer, FaCloud, FaBolt } from "react-icons/fa6";
import {
  BRAND_COLORS,
  DEP_ICON_SIZE,
  DEP_ICON_STYLE,
  STATUS_COLORS,
  STATUS_COLOR_FALLBACK,
} from "../constants/dependency-status";
import type { DepIconProps } from "../types/dependency.types";

export const DepIcon: React.FC<DepIconProps> = ({ name, status }) => {
  const n = name.toLowerCase();
  const color = STATUS_COLORS[status.toLowerCase()] ?? STATUS_COLOR_FALLBACK;

  if (n.includes("redis") || n.includes("valkey"))
    return <SiRedis size={DEP_ICON_SIZE} color={BRAND_COLORS.REDIS} style={DEP_ICON_STYLE} />;
  if (n.includes("mongo"))
    return <SiMongodb size={DEP_ICON_SIZE} color={BRAND_COLORS.MONGO} style={DEP_ICON_STYLE} />;
  if (n.includes("mysql"))
    return <SiMysql size={DEP_ICON_SIZE} color={BRAND_COLORS.MYSQL} style={DEP_ICON_STYLE} />;
  if (n.includes("postgre"))
    return <SiPostgresql size={DEP_ICON_SIZE} color={BRAND_COLORS.POSTGRES} style={DEP_ICON_STYLE} />;
  if (n.includes("cassandra"))
    return <SiApachecassandra size={DEP_ICON_SIZE} color={BRAND_COLORS.CASSANDRA} style={DEP_ICON_STYLE} />;
  if (n.includes("rabbit"))
    return <SiRabbitmq size={DEP_ICON_SIZE} color={BRAND_COLORS.RABBIT} style={DEP_ICON_STYLE} />;
  if (n.includes("kafka"))
    return <SiApachekafka size={DEP_ICON_SIZE} color={BRAND_COLORS.KAFKA} style={DEP_ICON_STYLE} />;
  if (n.includes("s3") || n.includes("storage"))
    return <FaCloud size={DEP_ICON_SIZE} color={BRAND_COLORS.S3} style={DEP_ICON_STYLE} />;
  if (n.includes("elastic"))
    return <SiElasticsearch size={DEP_ICON_SIZE} color={BRAND_COLORS.ELASTIC} style={DEP_ICON_STYLE} />;
  if (n.includes("bolt") || n.includes("cache"))
    return <FaBolt size={DEP_ICON_SIZE} color={color} style={DEP_ICON_STYLE} />;
  if (n.includes("cloud"))
    return <FaCloud size={DEP_ICON_SIZE} color={color} style={DEP_ICON_STYLE} />;
  if (n.includes("db") || n.includes("database"))
    return <FaDatabase size={DEP_ICON_SIZE} color={color} style={DEP_ICON_STYLE} />;

  return <FaServer size={DEP_ICON_SIZE} color={color} style={DEP_ICON_STYLE} />;
};
