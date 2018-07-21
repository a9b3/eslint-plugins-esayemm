all: help

help:
	@echo ""
	@echo "  deps       - Installs dependencies"
	@echo "  test       - Runs tests"
	@echo "  test.watch - TDD"
	@echo "  test.%     - Run tests for files with the included name"
	@echo ""

.PHONY: deps
deps:
	@yarn

test:
	@./node_modules/mocha/bin/mocha tests

test.watch:
	@./node_modules/mocha/bin/mocha --watch tests

test.%:
	@./node_modules/mocha/bin/mocha --watch tests
