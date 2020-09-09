import { Files, File, Build } from "estack";

export async function load(build: Build, listSrc: string[], root?: boolean) {
    const currentFiles: Files = listSrc.reduce((currentFiles: Files, src) => {
        if (!build.isAssigned(src)) {
            const file = build.addFile(src, { root });
            currentFiles[file.src] = file;
        }
        return currentFiles;
    }, {});

    const [task] = build.plugins.reduce(
        ([task, currentFiles], plugin) => {
            const nextCurrentFiles: Files = {};
            for (let src in currentFiles) {
                const file: File = currentFiles[src];
                if (plugin.filter && plugin.filter(file)) {
                    file.errors = [];
                    file.alerts = [];
                    file.assigned = true;
                    if (plugin.load) {
                        task.push(plugin.load(file, build));
                    }
                } else {
                    nextCurrentFiles[src] = file;
                }
            }
            return [task, currentFiles];
        },
        [[], currentFiles]
    );

    await Promise.all(task);
}