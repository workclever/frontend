import React, { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import { Command } from "cmdk";
import { CommandMenuProjects } from "./CommandMenuProjects";
import { CommandMenuBoards } from "./CommandMenuBoards";
import { CustomMenuTasks } from "./CustomMenuTasks";

export const CommandMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
        closeIcon={false}
        styles={{
          body: {
            margin: 0,
            padding: 0,
          },
          content: {
            margin: 0,
            padding: 0,
          },
        }}
      >
        <Command className="command-menu" loop shouldFilter={false}>
          <Command.Input
            ref={inputRef}
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search for something"
          />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <CommandMenuProjects
              search={search}
              onClose={() => setOpen(false)}
            />
            <CommandMenuBoards search={search} onClose={() => setOpen(false)} />
            <CustomMenuTasks search={search} onClose={() => setOpen(false)} />
          </Command.List>
        </Command>
      </Modal>
    </>
  );
};
