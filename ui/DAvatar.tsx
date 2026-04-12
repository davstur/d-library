"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "../utils";
import { Popover, PopoverTrigger, PopoverContent } from "../primitives/popover";
import { DButton } from "./DButton";

interface DAvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  showInfo?: boolean;
  /** @internal Used by DAvatarStack to add ring styling */
  _ring?: boolean;
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

function getDisplayName(
  firstName?: string | null,
  lastName?: string | null
): string | null {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  return null;
}

function AvatarCircle({
  initials,
  ring,
}: {
  initials: string;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-8 h-8 text-sm rounded-full flex items-center justify-center font-medium bg-primary text-primary-foreground flex-shrink-0",
        ring && "ring-2 ring-background"
      )}
    >
      {initials}
    </div>
  );
}

export function DAvatar({
  firstName,
  lastName,
  email,
  showInfo = false,
  _ring = false,
}: DAvatarProps) {
  const initials = getInitials(firstName, lastName, email);
  const displayName = getDisplayName(firstName, lastName);
  const [open, setOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, 200);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setOpen(false);
  }, []);

  if (!showInfo) {
    return <AvatarCircle initials={initials} ring={_ring} />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DButton
          variant="subtle"
          size="icon"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setOpen(!open)}
        >
          <AvatarCircle initials={initials} ring={_ring} />
        </DButton>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col gap-0.5">
          {displayName && <span className="font-medium">{displayName}</span>}
          {email && (
            <span className={displayName ? "text-background/70" : ""}>
              {email}
            </span>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * DAvatarStack - Overlapping avatar group for Tandemic design system
 */
interface DAvatarStackUser {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

interface DAvatarStackProps {
  users: DAvatarStackUser[];
}

export function DAvatarStack({ users }: DAvatarStackProps) {
  const max = 3;
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex -space-x-2">
      {displayUsers.map((user, index) => (
        <DAvatar
          key={user.email || index}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          _ring
        />
      ))}
      {remaining > 0 && (
        <div
          className="w-8 h-8 text-sm rounded-full flex items-center justify-center font-medium bg-muted text-muted-foreground ring-2 ring-background flex-shrink-0"
          title={`+${remaining} more`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
