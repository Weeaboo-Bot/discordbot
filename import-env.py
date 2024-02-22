import os
import subprocess

def import_secrets_from_file(env_file):
    """Reads secrets from an env file and sets them using flyctl secrets.

    Raises:
        subprocess.CalledProcessError: If any flyctl command fails.
    """

    with open(env_file) as f:
        for line in f:
            line = line.strip()  # Remove leading/trailing whitespace
            if line and not line.startswith("#"):  # Skip empty lines and comments
                key, value = line.split("=", 1)  # Split at first "="
                try:
                    subprocess.run(["flyctl", "secrets", "set", f"{key}={value}"],
                                          stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
                except subprocess.CalledProcessError as e:
                    print(f"Error setting secret {key}: {e}")
                    print(f"Command output: {e.output.decode()}")

# Replace ".env" with your actual file path if different
env_file = ".env"


# Import secrets from the env file
import_secrets_from_file(env_file)

# Additional actions after setting secrets (e.g., deployment, etc.)
# ...
