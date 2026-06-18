const fs = require("fs");

const originalUnlink = fs.unlink;
fs.unlink = function patchedUnlink(path, callback) {
  return originalUnlink.call(fs, path, (error) => {
    if (error && error.code === "EPERM") {
      callback(null);
      return;
    }
    callback(error);
  });
};

const originalRmdir = fs.rmdir;
fs.rmdir = function patchedRmdir(path, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = undefined;
  }

  const wrappedCallback = (error) => {
    if (error && error.code === "EPERM") {
      callback(null);
      return;
    }
    callback(error);
  };

  if (options === undefined) {
    return originalRmdir.call(fs, path, wrappedCallback);
  }

  return originalRmdir.call(fs, path, options, wrappedCallback);
};

if (fs.rm) {
  const originalRm = fs.rm;
  fs.rm = function patchedRm(path, options, callback) {
    if (typeof options === "function") {
      callback = options;
      options = undefined;
    }

    const wrappedCallback = (error) => {
      if (error && error.code === "EPERM") {
        callback(null);
        return;
      }
      callback(error);
    };

    if (options === undefined) {
      return originalRm.call(fs, path, wrappedCallback);
    }

    return originalRm.call(fs, path, options, wrappedCallback);
  };
}

const originalRename = fs.rename;
fs.rename = function patchedRename(oldPath, newPath, callback) {
  return originalRename.call(fs, oldPath, newPath, (error) => {
    if (!error || error.code !== "EPERM") {
      callback(error);
      return;
    }

    fs.cp(oldPath, newPath, { recursive: true, force: true }, (copyError) => {
      callback(copyError || null);
    });
  });
};

if (fs.promises && fs.promises.unlink) {
  const originalPromisesUnlink = fs.promises.unlink.bind(fs.promises);
  fs.promises.unlink = async function patchedPromisesUnlink(path) {
    try {
      return await originalPromisesUnlink(path);
    } catch (error) {
      if (error && error.code === "EPERM") {
        return undefined;
      }
      throw error;
    }
  };

  const originalPromisesRmdir = fs.promises.rmdir.bind(fs.promises);
  fs.promises.rmdir = async function patchedPromisesRmdir(path, options) {
    try {
      return await originalPromisesRmdir(path, options);
    } catch (error) {
      if (error && error.code === "EPERM") {
        return undefined;
      }
      throw error;
    }
  };

  if (fs.promises.rm) {
    const originalPromisesRm = fs.promises.rm.bind(fs.promises);
    fs.promises.rm = async function patchedPromisesRm(path, options) {
      try {
        return await originalPromisesRm(path, options);
      } catch (error) {
        if (error && error.code === "EPERM") {
          return undefined;
        }
        throw error;
      }
    };
  }

  const originalPromisesRename = fs.promises.rename.bind(fs.promises);
  fs.promises.rename = async function patchedPromisesRename(oldPath, newPath) {
    try {
      return await originalPromisesRename(oldPath, newPath);
    } catch (error) {
      if (error && error.code === "EPERM") {
        await fs.promises.cp(oldPath, newPath, { recursive: true, force: true });
        return undefined;
      }
      throw error;
    }
  };
}
