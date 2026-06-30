import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserBadges } from "@/app/_core/badgeActions";
import { badgeDefinitions } from "@/app/_core/badges";
import BadgeGrid from "@/components/profil/badgeGrid/BadgeGrid";
import TrainerClientView from "@/components/profil/clientProfile/TrainerClientView";
import styles from "./publicProfil.module.scss";

interface IPublicProfilPageProps {
	params: Promise<{ id: string }>;
}

export default async function PublicProfilPage({
	params,
}: IPublicProfilPageProps) {
	const { id } = await params;

	const [session, user, userBadges] = await Promise.all([
		auth(),
		prisma.user.findUnique({
			where: { id },
			select: { name: true, image: true },
		}),
		getUserBadges(id),
	]);

	if (!user) notFound();

	const viewerRole = session?.user?.role;
	const canViewProfile = viewerRole === "TRAINER" || viewerRole === "ADMIN";

	const clientProfile = canViewProfile
		? await prisma.clientProfile.findUnique({ where: { userId: id } })
		: null;

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				{user.image ? (
					<Image
						src={user.image}
						alt={user.name ?? "Avatar"}
						width={56}
						height={56}
						className={styles.avatar}
					/>
				) : (
					<div className={styles.avatarFallback}>
						{(user.name ?? "U").charAt(0).toUpperCase()}
					</div>
				)}
				<h1 className={styles.name}>{user.name ?? "Utilizator"}</h1>
			</div>

			{clientProfile && (
				<div className={styles.profileSection}>
					<TrainerClientView profile={clientProfile} memberId={id} />
				</div>
			)}

			{!clientProfile && canViewProfile && (
				<div className={styles.noProfile}>
					Clientul nu a completat fișa medicală încă.
				</div>
			)}

			<BadgeGrid
				allBadges={badgeDefinitions}
				unlockedBadges={userBadges}
				showLocked={false}
			/>
		</div>
	);
}
