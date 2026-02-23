pnpm dev --dev onboard

# Stops running gateways. 
pnpm dev --profile dev gateway stop

# Run the gateway. Exit it by Control + C
pnpm dev --dev gateway --verbose

# Hatch the bot
pnpm dev --dev tui

# Print logs
pnpm dev --dev logs

# List all the installed plugins
pnpm dev --dev plugins list

# Install the plugin
pnpm dev --dev plugins install --link ./extensions/omni-permission
